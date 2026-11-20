from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from app.main import app, create_admin

c = TestClient(app)
PW = "password-12345"


def signup(n):
    assert c.post("/auth/register", json={"email": f"{n}@college.test", "name": n, "password": PW}).status_code == 201


def login(n, pw=PW):
    r = c.post("/auth/login", json={"email": f"{n}@college.test", "password": pw})
    assert r.status_code == 200, r.text
    h = {"Authorization": "Bearer " + r.json()["token"]}
    return h, c.get("/me", headers=h).json()["id"]


def soon(days=3):
    return (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()


def test_end_to_end():
    assert c.post("/auth/register", json={"email": "x@gmail.com", "name": "x", "password": PW}).status_code == 403
    assert c.get("/me").status_code == 401
    create_admin("admin@college.test", "admin-password-123")
    A, _ = login("admin", "admin-password-123")
    k1 = c.post("/admin/clubs", json={"name": "Raag"}, headers=A).json()["id"]
    k2 = c.post("/admin/clubs", json={"name": "Chess"}, headers=A).json()["id"]
    for n in ["rep", "rep2", "fac", "s1", "s2"]:
        signup(n)
    R, rid = login("rep"); R2, rid2 = login("rep2"); F, fid = login("fac"); S1, _ = login("s1"); S2, _ = login("s2")
    assert c.post("/admin/users/%d/role" % rid, json={"role": "rep", "club_id": k1}, headers=S1).status_code == 403
    c.post(f"/admin/users/{rid}/role", json={"role": "rep", "club_id": k1}, headers=A)
    c.post(f"/admin/users/{rid2}/role", json={"role": "rep", "club_id": k2}, headers=A)
    c.post(f"/admin/users/{fid}/role", json={"role": "faculty"}, headers=A)
    body = {"title": "Open Mic", "cat": "Cultural", "start": soon(), "venue": "Amphitheatre", "cap": 1}
    assert c.post(f"/clubs/{k1}/events", json=body, headers=S1).status_code == 403   # student
    assert c.post(f"/clubs/{k1}/events", json=body, headers=R2).status_code == 403   # other club's rep
    e = c.post(f"/clubs/{k1}/events", json=body, headers=R).json()["id"]
    assert c.get("/events").json() == []                                            # drafts are private
    assert c.post(f"/events/{e}/register", headers=S1).status_code == 404
    assert c.post(f"/events/{e}/submit", headers=R).status_code == 200
    assert c.post(f"/events/{e}/review", json={"decision": "approve"}, headers=R).status_code == 403
    assert c.post(f"/events/{e}/review", json={"decision": "changes"}, headers=F).status_code == 422
    assert c.post(f"/events/{e}/review", json={"decision": "approve"}, headers=F).json()["status"] == "published"
    assert len(c.get("/events").json()) == 1
    r1 = c.post(f"/events/{e}/register", headers=S1).json()
    r2 = c.post(f"/events/{e}/register", headers=S2).json()
    assert r1["status"] == "going" and r2["status"] == "wait" and r2["pass_code"] is None
    assert c.post(f"/events/{e}/register", headers=S1).status_code == 409           # duplicate
    assert c.post(f"/events/{e}/checkin", json={"code": "0" * 24}, headers=R).status_code == 404
    assert c.post(f"/events/{e}/checkin", json={"code": r1["pass_code"]}, headers=R2).status_code == 403
    assert c.delete(f"/events/{e}/register", headers=S1).status_code == 200         # promotes s2
    r2 = [r for r in c.get("/me/registrations", headers=S2).json()][0]
    assert r2["status"] == "going" and r2["pass_code"]
    assert c.post(f"/events/{e}/checkin", json={"code": r2["pass_code"]}, headers=R).status_code == 200
    assert c.post(f"/events/{e}/checkin", json={"code": r2["pass_code"]}, headers=R).status_code == 409  # no double scan
    assert c.post(f"/events/{e}/certificates", headers=R).json() == {"issued": 1}
    assert c.post(f"/events/{e}/certificates", headers=R).json() == {"issued": 0}
    code = c.get("/me/registrations", headers=S2).json()[0]["certificate"]
    assert c.get(f"/certificates/{code}").json()["valid"] is True
    assert c.post(f"/certificates/{code}/revoke", headers=S2).status_code == 403
    c.post(f"/certificates/{code}/revoke", headers=F)
    assert c.get(f"/certificates/{code}").json()["valid"] is False


def test_login_throttle():
    signup("t1")
    for _ in range(5):
        assert c.post("/auth/login", json={"email": "t1@college.test", "password": "wrong-password"}).status_code == 401
    assert c.post("/auth/login", json={"email": "t1@college.test", "password": PW}).status_code == 429
