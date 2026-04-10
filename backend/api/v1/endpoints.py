from fastapi import APIRouter
from crud import cars, maintenance_logs, users

api_router = APIRouter()
api_router.include_router(cars.router, 
                          prefix="/v1/cars",
                          tags=["Car"])

api_router.include_router(maintenance_logs.router,
                          prefix="/v1/maintenance_logs",
                          tags=["Maintenance_log"])

api_router.include_router(users.router,
                          prefix="/v1/users",
                          tags=["User"])