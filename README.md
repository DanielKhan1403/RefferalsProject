

Referral Code Application
This is a Referral Code Management Application built with Django REST Framework (DRF) for the backend, PostgreSQL as the database, and React with Vite and Material UI for the frontend. The application allows users to register, login, and manage referral codes, as well as track users who have used their referral codes.

Features
User Registration & Login: Secure user authentication using tokens.
Referral Code Management: Users can generate and activate referral codes.
Profile Management: Users can view and update their profiles.
Invitation Tracking: Track users who have used a referral code.
Material UI Design: A responsive and modern UI built with Material UI components.
PostgreSQL Database: Data stored and managed in PostgreSQL.
Technologies Used
Backend: Django, Django REST Framework (DRF)
Database: PostgreSQL
Frontend: React, Vite, Material UI
Authentication: JWT Token Authentication
Deployment: PythonAnywhere for backend hosting
Prerequisites
Before running this project, ensure you have the following tools installed:

Node.js (for the frontend)
Python (for the backend)
PostgreSQL
Git (for cloning the repository)
Backend Setup (Django + DRF)
1. Clone the Repository

git clone https://github.com/yourusername/yourrepository.git
cd yourrepository
2. Create and Activate a Virtual Environment

python3 -m venv venv
source venv/bin/activate  # For Linux/Mac
venv\Scripts\activate  # For Windows
3. Install Backend Dependencies
pip install -r backend/requirements.txt
4. Set Up Database
Make sure PostgreSQL is installed and running. Create a new database for the project.


# Example to create a database on PostgreSQL
psql -U postgres
CREATE DATABASE referral_app;
Update the database settings in backend/settings.py to match your PostgreSQL database configuration:


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'referral_app',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
5. Run Migrations

cd backend
python manage.py migrate
6. Create a Superuser (Optional for Admin Access)

python manage.py createsuperuser
7. Run the Development Server

python manage.py runserver
Your backend should now be running at http://127.0.0.1:8000/.

Frontend Setup (React + Vite + Material UI)
1. Install Frontend Dependencies
Navigate to the frontend directory:


cd frontend
Install all necessary packages:


npm install
2. Update API URLs
In frontend/src/api.js (or wherever you make API requests), update the base URL for API requests:


const API_URL = "http://127.0.0.1:8000/api/v1";  // Update with your backend URL
3. Start the Frontend Development Server

npm run dev
Your frontend should now be running at http://localhost:3000/.

Usage
Register: Use the registration page to create a new user account. You'll receive a token upon successful registration.
Login: Log in with your credentials to receive a JWT token for authentication.
Activate Referral Code: If you have a referral code, you can enter it in the profile section to activate it.
Manage Profile: View and edit your profile, including the status of your referral code.
API Endpoints
1. Authentication
POST /api/v1/auth/register/ — Register a new user.
POST /api/v1/auth/login/ — Login with username and password to receive a JWT token.
2. Profile Management
GET /api/v1/auth/profile/ — Retrieve the profile information of the authenticated user.
PUT /api/v1/auth/profile/ — Update the profile information of the authenticated user.
3. Referral Code Management
POST /api/v1/auth/activate/ — Activate a referral code by providing the code.
GET /api/v1/auth/referrals/ — Retrieve a list of users who used your referral code.
Deployment
1. Backend Deployment
To deploy the backend, you can use services like PythonAnywhere, Heroku, or any other cloud provider that supports Python and PostgreSQL.

Follow the respective deployment instructions for your chosen platform.

2. Frontend Deployment
For the frontend, you can deploy using Vercel, Netlify, or any other service that supports static sites.

Make sure to update the API URL to point to the live backend URL.

Contributing
Feel free to fork this project, make changes, and submit pull requests.

License
This project is licensed under the MIT License.

Contact
For any questions or issues, feel free to reach out to the author at marakeshm1403@gmail.com.

Notes
Ensure your environment variables, such as database credentials, are securely handled (e.g., using .env files).
You may need to configure CORS (Cross-Origin Resource Sharing) in Django settings for frontend-backend communication if you're running them on different domains.
