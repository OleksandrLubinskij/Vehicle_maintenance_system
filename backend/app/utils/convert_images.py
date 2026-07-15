import io
from PIL import Image
from fastapi import UploadFile
import asyncio

def process_image(photo_b:bytes):
    im = Image.open(io.BytesIO(photo_b))
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA")

    im_buffer = io.BytesIO()
    
    im.save(im_buffer, format="WEBP", quality=80)
    return im_buffer.getvalue()

async def convert_image_webp(photo_b: UploadFile):
    await photo_b.seek(0)
    image = await photo_b.read()
    webp_image = await asyncio.to_thread(process_image, image)
    return webp_image