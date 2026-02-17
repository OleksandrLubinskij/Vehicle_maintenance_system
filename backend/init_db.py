from models import Base
from database import engine

def init_db(engine):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db(engine)
    print("Tables have been created succsefully!")
