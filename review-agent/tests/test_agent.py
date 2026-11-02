import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import agent  # noqa: E402
from agent import Config, Draft  # noqa: E402


def cfg(tmp_path, **kw):
    return Config(
        client_id="x", client_secret="x", refresh_token="x",
        location="accounts/1/locations/2", state_file=tmp_path / "state.json", **kw,
    )


def review(rid, stars="FIVE", replied=False, updated="2099-01-01T00:00:00Z", text="Great job"):
    r = {
        "name": f"accounts/1/locations/2/reviews/{rid}",
        "reviewId": rid,
        "reviewer": {"displayName": f"Person {rid}"},
        "starRating": stars,
        "comment": text,
        "updateTime": updated,
    }
    if replied:
        r["reviewReply"] = {"comment": "thanks"}
    return r


class FakeGoogle:
    def __init__(self, reviews):
        self.reviews = reviews
        self.posted = []

    def recent_reviews(self, since):
        return self.reviews

    def post_reply(self, name, text):
        self.posted.append((name, text))


class FakeDrafter:
    def __init__(self, needs_human=False):
        self.calls = 0
        self.needs_human = needs_human

    def draft(self, r):
        self.calls += 1
        return Draft(reply=f"Thanks {r['reviewer']['displayName']}",
                     needs_human=self.needs_human, reason="flag" if self.needs_human else "ok")


def test_parse_time_handles_nanoseconds():
    t = agent.parse_time("2026-11-01T03:04:05.123456789Z")
    assert t == datetime(2026, 11, 1, 3, 4, 5, 123456, tzinfo=timezone.utc)
    assert agent.parse_time("2026-11-01T03:04:05Z").year == 2026


def test_posts_good_reviews_and_skips_answered(tmp_path):
    g = FakeGoogle([review("a"), review("b", replied=True)])
    posted, held = agent.run(cfg(tmp_path), g, FakeDrafter())
    assert [p[0] for p in g.posted] == ["accounts/1/locations/2/reviews/a"]
    assert len(posted) == 1 and not held


def test_low_star_review_is_held_and_not_reemailed(tmp_path):
    c = cfg(tmp_path, auto_reply_min_stars=4)
    g = FakeGoogle([review("a", stars="TWO", text="Missed a spot")])
    d = FakeDrafter()
    posted, held = agent.run(c, g, d)
    assert not g.posted and len(held) == 1
    # Second run: same review, unchanged -> not drafted or emailed again.
    posted, held = agent.run(c, g, d)
    assert d.calls == 1 and not held
    # Reviewer edits it -> processed again.
    g.reviews = [review("a", stars="TWO", updated="2099-01-02T00:00:00Z")]
    posted, held = agent.run(c, g, d)
    assert d.calls == 2 and len(held) == 1


def test_claude_flag_holds_five_star(tmp_path):
    g = FakeGoogle([review("a", text="Great but they cracked a tile")])
    posted, held = agent.run(cfg(tmp_path), g, FakeDrafter(needs_human=True))
    assert not g.posted and held[0]["why"] == "flag"


def test_dry_run_posts_nothing_and_keeps_no_state(tmp_path):
    c = cfg(tmp_path, dry_run=True)
    g = FakeGoogle([review("a")])
    agent.run(c, g, FakeDrafter())
    assert not g.posted and not c.state_file.exists()


def test_empty_or_long_draft_is_held(tmp_path):
    c = cfg(tmp_path, auto_reply_min_stars=4)
    r = review("a")
    assert agent.decide(r, Draft(reply="", needs_human=False, reason="x"), c)[0] is False
    assert agent.decide(r, Draft(reply="x" * 5000, needs_human=False, reason="ok"), c)[0] is False
    assert agent.decide(r, Draft(reply="Thanks!", needs_human=False, reason="ok"), c) == (True, "")


def test_sign_off_added_once():
    s = "Coastcom Security Team"
    assert agent.add_sign_off("Hi Sam, thanks!", s) == "Hi Sam, thanks!\n\nCoastcom Security Team"
    assert agent.add_sign_off("Hi Sam, thanks!\n\n— Coastcom Security Team", s) == (
        "Hi Sam, thanks!\n\nCoastcom Security Team"
    )
    assert agent.add_sign_off("", s) == ""
    assert agent.add_sign_off("Hi", "") == "Hi"


def test_one_star_auto_posts_by_default(tmp_path):
    g = FakeGoogle([review("a", stars="ONE", text="Slow to respond")])
    posted, held = agent.run(cfg(tmp_path), g, FakeDrafter())
    assert len(g.posted) == 1 and not held
