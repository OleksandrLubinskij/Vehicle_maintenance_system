FROM python:3.14.5-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /backend_workdir
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN mkdir -p /backend_workdir/static/car_images
COPY . .
EXPOSE 8001
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8001}"]