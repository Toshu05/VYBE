"""Test suite for CampusConnect features:
- Campaign generation & attribution
- Conflict detection
- Grounded AI endpoints
- Analytics funnel
- Kiosk display feed
"""
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from app.main import app, create_admin

c = TestClient(app)
PW = "password-12345"

def signup(n, role="student"):
    assert c.post("/auth/register", json={"email": f"{n}@college.test", "name": n, "password": PW}).status_code == 201

def login(n, pw=PW):
    r = c.post("/auth/login", json={"email": f"{n}@college.test", "password": pw})
    assert r.status_code == 200, r.text
    h = {"Authorization": "Bearer " + r.json()["token"]}
    return h, c.get("/me", headers=h).json()["id"]

def soon(days=3):
    return (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()

def test_campaign_and_analytics_flow():
    # Setup users
    create_admin("admin_cc@college.test", "admin-pass-123")
    A, _ = login("admin_cc", "admin-pass-123")
    club_id = c.post("/admin/clubs", json={"name": "GDSC ABES"}, headers=A).json()["id"]
    
    signup("rep_gdsc")
    R, rid = login("rep_gdsc")
    c.post(f"/admin/users/{rid}/role", json={"role": "rep", "club_id": club_id}, headers=A)
    
    signup("fac_gdsc")
    F, fid = login("fac_gdsc")
    c.post(f"/admin/users/{fid}/role", json={"role": "faculty"}, headers=A)
    
    signup("student_alex")
    S, _ = login("student_alex")

    # Rep creates event
    body = {
        "title": "Cloud Study Jam",
        "cat": "Technical",
        "start": soon(4),
        "venue": "B-Block Lab 3",
        "cap": 50,
        "about": "Hands-on cloud architecture workshop for ABES engineers.",
        "rules": "Bring laptop with active browser."
    }
    e_res = c.post(f"/clubs/{club_id}/events", json=body, headers=R)
    assert e_res.status_code == 201
    eid = e_res.json()["id"]

    # Rep creates promotional campaigns
    camp1 = c.post(f"/events/{eid}/campaigns", json={"name": "Library Standee", "channel": "standee"}, headers=R).json()
    camp2 = c.post(f"/events/{eid}/campaigns", json={"name": "CSE 3rd Yr Class Visit", "channel": "classroom"}, headers=R).json()
    assert camp1["channel"] == "standee"
    assert camp2["channel"] == "classroom"

    # Test shortcode resolution increments scans
    code = camp1["short_code"]
    res_redir = c.get(f"/c/{code}", follow_redirects=False)
    assert res_redir.status_code == 307
    assert f"campaign={camp1['id']}" in res_redir.headers["location"]

    # Check slide data
    slide_res = c.get(f"/campaigns/{camp2['id']}/slide")
    assert slide_res.status_code == 200
    assert slide_res.json()["event_title"] == "Cloud Study Jam"

    # Faculty approves
    c.post(f"/events/{eid}/submit", headers=R)
    c.post(f"/events/{eid}/review", json={"decision": "approve"}, headers=F)

    # Student registers with campaign attribution
    reg_res = c.post(f"/events/{eid}/register?campaign_id={camp1['id']}", headers=S)
    assert reg_res.status_code == 201
    pass_code = reg_res.json()["pass_code"]

    # Check-in student
    c.post(f"/events/{eid}/checkin", json={"code": pass_code}, headers=R)

    # Check event analytics
    analytics_res = c.get(f"/analytics/event/{eid}", headers=R)
    assert analytics_res.status_code == 200
    data = analytics_res.json()
    assert data["total_scans"] >= 1
    assert data["total_registrations"] == 1
    assert data["total_attended"] == 1
    assert "standee" in data["channels"]

    # Check institutional analytics
    inst_res = c.get("/analytics/institutional", headers=A)
    assert inst_res.status_code == 200
    assert inst_res.json()["institution"] == "ABES Engineering College"

def test_conflict_detection():
    create_admin("admin_conf@college.test", "admin-pass-123")
    A, _ = login("admin_conf", "admin-pass-123")
    club_id = c.post("/admin/clubs", json={"name": "RoboClub"}, headers=A).json()["id"]

    signup("rep_robo")
    R, rid = login("rep_robo")
    c.post(f"/admin/users/{rid}/role", json={"role": "rep", "club_id": club_id}, headers=A)
    
    signup("fac_robo")
    F, fid = login("fac_robo")
    c.post(f"/admin/users/{fid}/role", json={"role": "faculty"}, headers=A)

    t_start = soon(5)
    e1 = c.post(f"/clubs/{club_id}/events", json={
        "title": "AI Summit Day 1",
        "cat": "Technical",
        "start": t_start,
        "venue": "Auditorium 1",
        "cap": 200
    }, headers=R).json()["id"]
    
    c.post(f"/events/{e1}/submit", headers=R)
    c.post(f"/events/{e1}/review", json={"decision": "approve"}, headers=F)

    # Create 2nd event with same venue and time
    e2 = c.post(f"/clubs/{club_id}/events", json={
        "title": "Robotics Expo",
        "cat": "Technical",
        "start": t_start,
        "venue": "Auditorium 1",
        "cap": 150
    }, headers=R).json()["id"]

    conflicts = c.get(f"/events/{e2}/conflicts").json()
    assert conflicts["has_clash"] is True
    assert conflicts["clashes"][0]["id"] == e1

def test_grounded_ai_endpoints():
    copy_res = c.post("/ai/generate-copy", json={
        "title": "Smart India Hackathon Internal ABES",
        "cat": "Technical"
    })
    assert copy_res.status_code == 200
    assert "Smart India Hackathon" in copy_res.json()["headline"]
    assert len(copy_res.json()["taglines"]) == 3

    strategy_res = c.post("/ai/generate-strategy", json={
        "title": "Chess Open",
        "cat": "Gaming",
        "days_until_event": 5
    })
    assert strategy_res.status_code == 200
    assert len(strategy_res.json()["campaign_timeline"]) >= 4

    chat_res = c.post("/ai/assistant", json={"question": "What technical events are happening?"})
    assert chat_res.status_code == 200
    assert "ABES" in chat_res.json()["answer"]

def test_kiosk_feed():
    feed_res = c.get("/kiosk/feed")
    assert feed_res.status_code == 200
    assert isinstance(feed_res.json(), list)
