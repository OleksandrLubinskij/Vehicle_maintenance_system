import os
import pathlib
LIMITATIONS = {
        "oil_and_filters": 10000,
        "belt_replacement": 60000,
        "inspection_mileage": 10000,
        "inspection_time": 365
    }

TEXT_INDICATORS = {
    0: "Записи відсутні",
    1: "Все впорядку",
    2: "Стан нормальний",
    3: "Стан критичний",
    4: "Ліміти перевищені!"
}

class CACHE:
    CARS="cars"

class USER:
    LOGIN = "login"
    PASSWORD = "password"
    ROLE = "role"

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

CAR_PHOTO_PATH = pathlib.Path(__file__).parent.parent / "static" / "car_images"