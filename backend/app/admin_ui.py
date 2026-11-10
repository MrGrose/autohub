from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm.attributes import flag_modified
from sqladmin import Admin, ModelView
from starlette.requests import Request
from wtforms import (
    BooleanField,
    Form,
    IntegerField,
    StringField,
    TextAreaField,
)
from wtforms.validators import DataRequired, Length, NumberRange, Optional

from app.admin_auth import AdminAuth
from app.country_code import make_country_code
from app.config import settings
from app.database import SessionLocal
from app.media import delete_car_media_dir, remove_relative_paths, save_form_files
from app.models import Car, ImportCountry, ImportPriceItem, PriceSegment

COUNTRY_CHOICES = [
    ("", "— не указана —"),
    ("UAE", "ОАЭ"),
    ("China", "Китай"),
    ("Korea", "Корея"),
    ("Japan", "Япония"),
]
COUNTRY_SUGGESTIONS = [code for code, _ in COUNTRY_CHOICES if code]


class CarAdminForm(Form):
    name = StringField("Название", validators=[DataRequired(), Length(max=500)])
    country = StringField(
        "Страна",
        validators=[Optional(), Length(max=32)],
        render_kw={"placeholder": "ОАЭ, Китай или свой вариант", "list": "country-suggest"},
    )
    price_rub = IntegerField(
        "Цена, ₽",
        validators=[Optional(), NumberRange(min=0, max=999_999_999)],
    )
    description = TextAreaField("Описание")
    featured = BooleanField("На главной")
    is_active = BooleanField("Показывать на сайте", default=True)


class CarAdmin(ModelView, model=Car):
    form = CarAdminForm
    list_template = "sqladmin/list.html"
    edit_template = "sqladmin/car_edit.html"
    create_template = "sqladmin/car_create.html"

    category = "Предложения"
    name = "Авто"
    name_plural = "Авто"
    can_view_details = False

    column_list = [Car.name, Car.country, Car.price_rub, Car.featured, Car.is_active]
    column_searchable_list = [Car.name]

    column_labels = {
        Car.name: "Название",
        Car.country: "Страна",
        Car.price_rub: "Цена, ₽",
        Car.description: "Описание",
        Car.featured: "На главной",
        Car.is_active: "На сайте",
        Car.photos: "Фото",
        Car.created_at: "Создано",
        Car.updated_at: "Обновлено",
    }

    form_excluded_columns = [Car.photos, Car.created_at, Car.updated_at]

    column_formatters = {
        Car.country: lambda car, _: (
            dict(COUNTRY_CHOICES).get(car.country or "", car.country) if car.country else "—"
        ),
    }

    def search_placeholder(self) -> str:
        return "Поиск по названию"

    country_suggestions = COUNTRY_SUGGESTIONS

    async def on_model_delete(self, model: Car, request: Request) -> None:
        delete_car_media_dir(model.id)

    async def on_model_change(
        self,
        data: dict,
        _model: Car,
        _is_created: bool,
        _request: Request,
    ) -> None:
        # Поле только в форме — не пишем в ORM (иначе setattr падает).
        data.pop("photo_files", None)

    async def after_model_change(
        self,
        data: dict,
        model: Car,
        is_created: bool,
        request: Request,
    ) -> None:
        form = await request.form()
        raw = form.getlist("photo_files")
        if not raw:
            return

        paths = await save_form_files(model.id, raw)
        if not paths:
            return

        try:
            with SessionLocal() as session:
                car = session.get(Car, model.id)
                if not car:
                    remove_relative_paths(paths)
                    return
                photos = list(car.photos or [])
                photos.extend(paths)
                car.photos = photos
                flag_modified(car, "photos")
                session.commit()
        except Exception:
            remove_relative_paths(paths)
            raise


class ImportCountryAdminForm(Form):
    label = StringField(
        "Название",
        validators=[DataRequired(), Length(max=64)],
        render_kw={"placeholder": "Например: Китай, Германия"},
    )
    sort_order = IntegerField("Порядок", validators=[Optional(), NumberRange(min=0, max=9999)], default=0)
    is_active = BooleanField("Активна", default=True)


class ImportCountryAdmin(ModelView, model=ImportCountry):
    form = ImportCountryAdminForm
    list_template = "sqladmin/list.html"
    create_template = "sqladmin/admin_create.html"
    edit_template = "sqladmin/admin_edit.html"
    category = "Прайс под импорт"
    name = "Страна"
    name_plural = "Страны"
    can_view_details = False
    column_list = [ImportCountry.label, ImportCountry.code, ImportCountry.sort_order, ImportCountry.is_active]
    column_searchable_list = [ImportCountry.label, ImportCountry.code]
    column_default_sort = [(ImportCountry.sort_order, False)]
    column_labels = {
        ImportCountry.code: "Код (авто)",
        ImportCountry.label: "Название",
        ImportCountry.sort_order: "Порядок",
        ImportCountry.is_active: "Активна",
    }
    form_excluded_columns = [ImportCountry.items, ImportCountry.code]

    def search_placeholder(self) -> str:
        return "Поиск по названию или коду"

    async def on_model_change(
        self,
        data: dict,
        _model: ImportCountry,
        is_created: bool,
        _request: Request,
    ) -> None:
        if not is_created:
            return
        label = (data.get("label") or "").strip()
        if not label:
            return
        with SessionLocal() as session:
            taken = set(session.scalars(select(ImportCountry.code)).all())
        data["code"] = make_country_code(label, taken)


class PriceSegmentAdminForm(Form):
    label = StringField(
        "Сегмент",
        validators=[DataRequired(), Length(max=64)],
        render_kw={"placeholder": "Например: До 2 млн ₽"},
    )
    sort_order = IntegerField("Порядок", validators=[Optional(), NumberRange(min=0, max=9999)], default=0)
    is_active = BooleanField("Активен", default=True)


class PriceSegmentAdmin(ModelView, model=PriceSegment):
    form = PriceSegmentAdminForm
    list_template = "sqladmin/list.html"
    create_template = "sqladmin/admin_create.html"
    edit_template = "sqladmin/admin_edit.html"
    category = "Прайс под импорт"
    name = "Ценовой сегмент"
    name_plural = "Ценовые сегменты"
    can_view_details = False
    column_list = [PriceSegment.label, PriceSegment.sort_order, PriceSegment.is_active]
    column_searchable_list = [PriceSegment.label]
    column_default_sort = [(PriceSegment.sort_order, False)]
    column_labels = {
        PriceSegment.label: "Сегмент",
        PriceSegment.sort_order: "Порядок",
        PriceSegment.is_active: "Активен",
    }
    form_excluded_columns = [PriceSegment.items]

    def search_placeholder(self) -> str:
        return "Поиск по сегменту"


class ImportPriceItemAdmin(ModelView, model=ImportPriceItem):
    list_template = "sqladmin/list.html"
    create_template = "sqladmin/admin_create.html"
    edit_template = "sqladmin/admin_edit.html"
    category = "Прайс под импорт"
    name = "Авто лист"
    name_plural = "Авто лист"
    can_view_details = False
    column_list = [
        ImportPriceItem.name,
        ImportPriceItem.specs,
        ImportPriceItem.horsepower,
        ImportPriceItem.country,
        ImportPriceItem.segment,
        ImportPriceItem.sort_order,
        ImportPriceItem.is_active,
    ]
    column_searchable_list = [ImportPriceItem.name, ImportPriceItem.specs, ImportPriceItem.horsepower]
    column_default_sort = [(ImportPriceItem.sort_order, False)]
    column_labels = {
        ImportPriceItem.name: "Модель",
        ImportPriceItem.specs: "Двигатель",
        ImportPriceItem.horsepower: "Л.С.",
        ImportPriceItem.country: "Страна",
        ImportPriceItem.segment: "Сегмент",
        ImportPriceItem.sort_order: "Порядок",
        ImportPriceItem.is_active: "На сайте",
    }
    form_columns = [
        ImportPriceItem.name,
        ImportPriceItem.specs,
        ImportPriceItem.horsepower,
        ImportPriceItem.country,
        ImportPriceItem.segment,
        ImportPriceItem.sort_order,
        ImportPriceItem.is_active,
    ]
    form_include_pk = False

    def search_placeholder(self) -> str:
        return "Поиск по модели или двигателю"


def setup_admin(app, engine) -> Admin:
    templates_dir = str(Path(__file__).resolve().parent.parent / "templates")
    admin = Admin(
        app,
        engine,
        base_url="/admin",
        title="Админ панель",
        templates_dir=templates_dir,
        authentication_backend=AdminAuth(secret_key=settings.secret_key),
    )
    admin.add_view(CarAdmin)
    admin.add_view(ImportCountryAdmin)
    admin.add_view(PriceSegmentAdmin)
    admin.add_view(ImportPriceItemAdmin)
    return admin
