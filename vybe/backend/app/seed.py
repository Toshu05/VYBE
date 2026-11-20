"""Create the first super admin: ADMIN_EMAIL=... ADMIN_PASSWORD=... python -m app.seed"""
import os
from app.main import create_admin

create_admin(os.environ["ADMIN_EMAIL"], os.environ["ADMIN_PASSWORD"])
print("Admin ready")
