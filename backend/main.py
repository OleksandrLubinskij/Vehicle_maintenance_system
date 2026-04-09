from fastapi import FastAPI
from crud import cars, maintenance_logs, users

app = FastAPI()

app.include_router(cars.router)
app.include_router(maintenance_logs.router)
app.include_router(users.router)


