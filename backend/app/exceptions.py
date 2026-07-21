class BaseError(Exception):
    def __init__(self, error_detail: str | None = None):
        self.error_detail = error_detail

class NotFoundError(BaseError):
    pass