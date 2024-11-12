# Backend README

## Overview
This backend project is built using Django and provides APIs for user authentication, content management, and personalized recommendations. It serves as the server-side logic for the web application.

---

## Project Structure

### Directory Breakdown

- **`backend/`**: Contains the entire Django project.
  
- **`config/`**: 
  - Contains all configuration files and settings for the application, including URL routing and Django settings.

- **`authentication/`**: 
  - Handles user authentication processes such as login and signup logic.

- **`content_management/`**: 
  - Manages the content of the website, including API requests to fetch and serve content.

- **`recommendations/`**: 
  - Provides logic for suggesting content to users based on their interests and interactions.

- **`user_preferences/`**: 
  - Stores user preferences for the types of content they want to see.

- **`user_profile/`**: 
  - Manages user-related information, including profiles, settings, and other personal details.

---

## Technologies Used

- **Django**: The primary framework for building the backend.
- **Django Rest Framework**: Used for creating RESTful APIs.
- **SQLite**: Database for development 
- **Docker**: For containerization and ensuring consistency across environments.
- **GithubAction**: For continuous integration and continuous deployment (CI/CD)

---

## Installation

### Prerequisites

- [Python 3.x](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/)
- [Docker](https://docs.docker.com/get-docker/)

### Environment Variables

Create a `.env` file in the root of the project with the following variables:

    ```plaintext
    API_KEY_TOKEN=your_api_key_here
    ```

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/djenebaa/Uri
    cd Uri/backend
    ```

2. Build and run the Docker containers:
    ```bash
     docker compose up --build -d
    ```

3. To stop the containers, use:
    ```bash
    docker-compose down
    ```

The backend will be accessible at `http://localhost:8218`.

---

## Features

- **User Authentication**: Secure login and signup functionalities.
- **Content Management**: APIs to manage and serve content dynamically.
- **Personalized Recommendations**: Algorithms to suggest content based on user preferences.

---

## Running Tests

To run tests for the backend, use:
```bash
python manage.py test
```


