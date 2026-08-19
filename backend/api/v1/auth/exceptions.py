class BaseAuthError(Exception):
    def __init__(self, error_detail: str | None = None):
        self.error_detail = error_detail

class UserNotFoundError(BaseAuthError):
    pass

class InvalidPasswordError(BaseAuthError):
    pass

class UserAlreadyExistsError(BaseAuthError):
    pass

class NotAuthenticatedError(BaseAuthError):
    def __init__(self, error_detail: str | None):
        super().__init__(error_detail)

class PermissionDeniedError(BaseAuthError):
    pass