import secrets

from app.config import settings


def verify_admin_credentials(username: str, password: str) -> bool:
    """Constant-time check for admin username/password."""
    user_ok = secrets.compare_digest(
        username.encode("utf-8"),
        settings.admin_username.encode("utf-8"),
    )
    pass_ok = secrets.compare_digest(
        password.encode("utf-8"),
        settings.admin_password.encode("utf-8"),
    )
    return user_ok and pass_ok
