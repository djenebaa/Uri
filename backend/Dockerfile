# Use an official image for Python
FROM python:3.10-slim

# Define the work directory
WORKDIR /app

# Copy the requirements.txt file and install the dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application
COPY . .

# Expose Django default port 
EXPOSE 8218

# Run the migrations and the application
CMD ["python", "manage.py", "migrate"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8218"]
