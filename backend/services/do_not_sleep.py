from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def do_not_sleep():
    return {"message": "Ughhhh, I don`t sleep!"}