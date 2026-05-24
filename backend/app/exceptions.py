from fastapi import Request
from fastapi.responses import JSONResponse

class DBErrors(Exception):
    def __init__(self, message: str = "Database error"):
        self.message = message

class RecordNotFoundError(DBErrors):
    def __init__(self, message: str = "Record not found!"):
        super().__init__(message)

async def general_db_errors_handler(request: Request, exc: DBErrors):
    return JSONResponse(
        status_code=500,
        content={"Message": exc.message}
    )
async def record_not_found_error_handler(request: Request, exc: RecordNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"message": exc.message}
    )
