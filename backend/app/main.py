from fastapi import FastAPI
from api.v1 import endpoints
from app.exceptions import DBErrors, RecordNotFoundError, general_db_errors_handler, record_not_found_error_handler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.include_router(endpoints.api_router)

app.add_exception_handler(DBErrors, general_db_errors_handler)
app.add_exception_handler(RecordNotFoundError, record_not_found_error_handler)

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)