# Metascale Health 🩺

**Metascale Health** is a health screening platform built to help users assess their risk for chronic conditions such as Liver disease and Diabetes. The system uses predictive models to analyze clinical data and provide clear health insights to patients and medical professionals.

---

## ✨ Main Features

The platform is divided into specialized sections for different types of users:

### For Patients
* **Health Screening Portal**: Users can complete assessments for Liver and Diabetes health by entering clinical values.
* **Risk History**: A personal dashboard shows past screening results, risk levels, and specific health recommendations.
* **Appointment Management**: Patients can schedule and track consultations (in-person, video, or phone) with doctors.
* **Health Profile**: A central place to manage medical background info like blood group, hypertension history, and current medications.

### For Doctors
* **Patient List**: Medical staff can view their assigned patients and review their detailed medical records.
* **Screening Reviews**: Doctors can add professional comments to screening results and flag specific cases for urgent follow-up.
* **Schedule Tracking**: A dedicated portal to manage upcoming appointments and patient consultations.

### For Admins
* **System Management**: Portals to manage doctor registrations and monitor overall platform activity.

---

## 🛠️ How it Works

The project is built using a modern technical setup to ensure security and accurate results:

* **Frontend**: Built with **React 19** and **Tailwind CSS** for a responsive user experience.
* **Main Backend**: A **Node.js** and **Express** server manages user accounts, secure login, and database requests.
* **Database**: **MySQL** is used to store all user profiles, medical assessments, and appointment details.
* **Predictive API**: A separate **Python (FastAPI)** service runs the mathematical models that calculate health risks.

---

## 📦 Project Structure

* `healthapp/frontend`: The React-based user interface.
* `healthapp/backend`: The main API that connects the interface to the database.
* `notebooks/`: Research and logic used to build the predictive models.

---

## 🔧 Local Setup

### 1. Database Setup
Import the provided `schema.sql` file into your MySQL instance to create the necessary tables for users and screenings.

### 2. Environment Configuration
Create a `.env` file in the `healthapp/backend` directory with your database credentials and a secret key for secure authentication.

### 3. Running the Platform
You will need to start three separate components:

```bash
# Start the Main Backend
cd healthapp/backend && npm install && npm run dev

# Start the Frontend
cd healthapp/frontend && npm install && npm run dev

# Start the Predictive API
cd API/backend && pip install -r requirements.txt && python main.py
```

---

## 📄 License
*Private/Internal project for Metascale Health.*
