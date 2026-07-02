from contextlib import asynccontextmanager
from aiobotocore.session import get_session

class S3Client:
    def __init__(self,
                 access_key: str,
                 secret_key: str,
                 endpoint_url: str,
                 bucket_name: str
                 ):
    
        self.config = {
            "aws_access_key_id": access_key,
            "aws_secret_access_key": secret_key,
            "endpoint_url": endpoint_url,
            "region_name": "auto"
        }
        self.bucket_name = bucket_name
        self.session = get_session()

    @asynccontextmanager
    async def get_client(self):
        async with self.session.create_client("s3", **self.config) as client:
            yield client

    async def upload_file(
            self, 
            file_data: bytes, 
            object_name: str,
            content_type: str = "application/octet-stream"
    ):
        
        async with self.get_client() as client:
            await client.put_object(
                Bucket=self.bucket_name,
                Key=object_name,
                Body=file_data,
                ContentType=content_type
            )

    async def delete_file(self, object_name: str):
        async with self.get_client() as client:
            await client.delete_object(
                Bucket=self.bucket_name,
                Key=object_name
            )