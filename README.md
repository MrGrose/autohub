# Autohub

Каталог автомобилей с публичным сайтом на Next.js и админкой на FastAPI. Демонстрационный проект: каталог с фильтрами и сортировкой, галерея фото, управление объявлениями, прайс-лист импорта и защищенная админка.

## Возможности

- Каталог с фильтром по стране, сортировкой по цене и пагинацией.
- Карточки автомобилей с несколькими фото и просмотром в lightbox.
- Админка: создание, редактирование и скрытие объявлений, загрузка и удаление фото.
- Прайс-лист импорта по странам и ценовым сегментам.
- Защита админки: сессия, CSRF-токены, ограничение попыток входа.
- Публичный API с кешем на стороне сайта.
- Docker Compose для backend и PostgreSQL.

## Стек

| Часть | Технологии |
|-------|------------|
| Сайт | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, SQLAlchemy 2, Pydantic, SQLAdmin |
| База | PostgreSQL 16 |
| Инфраструктура | Docker Compose, GitHub Actions |

## Архитектура

```
Браузер
  |
  v
Next.js (website/) ---> FastAPI (backend/) ---> PostgreSQL
                              |
                              +--> uploads/ (фото)
```

Сайт получает каталог через `GET /api/v1/cars`. Админка работает через SQLAdmin и сессионную авторизацию. Фото хранятся на диске, публичный URL собирается из `PUBLIC_MEDIA_URL`.

## Быстрый старт

### Backend и база

```bash
cd backend
cp .env.example .env
docker compose up --build -d
curl http://127.0.0.1:8000/health
```

API: `http://127.0.0.1:8000/api/v1/cars`
Админка: `http://127.0.0.1:8000/admin`
Swagger: `http://127.0.0.1:8000/docs` (логин и пароль из `.env`)

### Сайт

```bash
cd website
cp .env.example .env.local
npm ci
npm run dev
```

Сайт: `http://localhost:3000`

## Тесты

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
pytest -q
```

Тесты используют PostgreSQL. Поднимите базу через `docker compose up -d db` и задайте `DATABASE_URL`, например:

```bash
export DATABASE_URL=postgresql+psycopg2://autohub:autohub@127.0.0.1:5434/autohub
```

## CI

GitHub Actions проверяет backend и сайт:

- `ruff check` и `pytest` для FastAPI.
- `npm ci` и `npm run build` для Next.js.

## Ограничения

- Это демонстрационный проект, а не готовый SaaS.
- Нет ролей и мультитенантности, админ один.
- Фото хранятся на локальном диске, без S3.
- Нет фоновых задач и очередей.
- Поиск по каталогу ограничен фильтром по стране и сортировкой.

## Лицензия

MIT, см. `LICENSE`.
