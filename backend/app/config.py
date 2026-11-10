from pydantic_settings import BaseSettings, SettingsConfigDict

INSECURE_SECRET_KEYS = frozenset({"dev-secret-change-me", "change-me-openssl-rand-hex-32"})
INSECURE_ADMIN_PASSWORDS = frozenset({"admin123", "change-me", "admin"})


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    database_url: str = "postgresql+psycopg2://autohub:autohub@localhost:5434/autohub"
    secret_key: str = "dev-secret-change-me"
    admin_username: str = "admin"
    admin_password: str = "admin123"
    media_root: str = "uploads"
    public_media_url: str = "http://127.0.0.1:8000/media"

    @property
    def is_production(self) -> bool:
        return self.app_env.strip().lower() == "production"


settings = Settings()


def validate_production_settings() -> None:
    if not settings.is_production:
        return
    errors: list[str] = []
    if settings.secret_key.strip() in INSECURE_SECRET_KEYS or len(settings.secret_key.strip()) < 32:
        errors.append("SECRET_KEY: задайте openssl rand -hex 32 (минимум 32 символа)")
    if settings.admin_password.strip() in INSECURE_ADMIN_PASSWORDS:
        errors.append("ADMIN_PASSWORD: смените дефолтный пароль")
    if len(settings.admin_password.strip()) < 12:
        errors.append("ADMIN_PASSWORD: минимум 12 символов")
    if errors:
        raise RuntimeError("Небезопасная конфигурация production:\n- " + "\n- ".join(errors))
