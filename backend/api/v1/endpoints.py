from fastapi import APIRouter, Depends
from crud import cars, maintenance_logs, car_photo, fuel_log
import api.v1.auth.api_auth as api_auth
from services import get_enums
from api.v1.auth.get_current_user import get_current_user
from services import do_not_sleep
api_router = APIRouter()

api_router.include_router(cars.router, 
                          prefix="/v1/cars",
                          tags=["Car"],
                          dependencies=[Depends(get_current_user)])

api_router.include_router(maintenance_logs.router,
                          prefix="/v1/maintenance_logs",
                          tags=["Maintenance log"],
                          dependencies=[Depends(get_current_user)])

api_router.include_router(api_auth.router,
                          prefix="/v1/users",
                          tags=["User"])

api_router.include_router(car_photo.router,
                          prefix="/v1/car_photos",
                          tags=["Car photo"],
                          dependencies=[Depends(get_current_user)])

api_router.include_router(fuel_log.router,
                          prefix="/v1/fuel_logs",
                          tags=["Fuel log"],
                          dependencies=[Depends(get_current_user)])

api_router.include_router(get_enums.router,
                          prefix="/v1/get_enums",
                          tags=["Get Enums"],
                          dependencies=[Depends(get_current_user)])

api_router.include_router(do_not_sleep.router, prefix="/v1/do_not_sleep", tags=["Do Not Sleep"])
