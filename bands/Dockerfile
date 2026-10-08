FROM python:3.13-slim

WORKDIR /bands

ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py migrate

EXPOSE 8040

CMD ["python", "manage.py", "runserver", "0.0.0.0:8040"]
