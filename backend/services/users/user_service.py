from services.base_service import BaseCRUDService

class UserService(BaseCRUDService):
    def __init__(self, repo):
        super().__init__(repo)
        