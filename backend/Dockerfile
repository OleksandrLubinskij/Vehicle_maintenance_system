FROM python:3.14.5-slim
WORKDIR /backend_workdir
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY backend .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]