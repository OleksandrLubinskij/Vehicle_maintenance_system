import os
from app.s3.s3_client import S3Client

def get_s3():
    BUCKET_NAME=os.getenv("BUCKET_NAME")
    ENDPOINT_URL=os.getenv("ENDPOINT_URL")
    ACCESS_KEY=os.getenv("ACCESS_KEY")
    SECRET_S3_KEY=os.getenv("SECRET_S3_KEY")

    s3 = S3Client(
        access_key=ACCESS_KEY,
        secret_key=SECRET_S3_KEY,
        endpoint_url=ENDPOINT_URL,
        bucket_name=BUCKET_NAME
    )
    return s3