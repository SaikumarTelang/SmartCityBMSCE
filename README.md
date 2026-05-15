# CivicPulse - Smart City Infrastructure Tracker

A modern, AI-powered smart city application for reporting and tracking infrastructure issues like garbage, potholes, and broken wires.

## 📋 Table of Contents
- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Team](#team)

---

## 🚀 About the Project

CivicPulse is a smart city platform that empowers citizens to report infrastructure issues using AI-powered detection. The app automatically identifies problems like garbage accumulation, potholes, and broken wires from uploaded images.

### Key Highlights
- **AI-Powered Detection**: Upload an image and let our AI detect issues automatically
- **Live Map**: View all reported issues on an interactive map
- **Priority System**: Reports with multiple votes get higher priority
- **Admin Dashboard**: BBMP officers can manage and resolve issues efficiently
- **Gamification**: Earn badges and points for reporting issues

---

## 🛠️ Tech Stack

### AI Model Training & Inference
- **Programming Language**: Python
- **Deep Learning Frameworks**: PyTorch + TorchVision
- **Object Detection**: Ultralytics YOLO (Garbage & Pothole)
- **Custom Model**: PyTorch (Broken Wire Detection)
- **Image Processing**: Pillow
- **Numerical Computing**: NumPy

### Frontend (Client)
- **Framework**: React 18.3.1
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM 6.28.0
- **Database/Auth**: Firebase (Firestore + Authentication)
- **Maps**: Leaflet + React Leaflet
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Admin SDK (Firestore)
- **Middleware**:
  - CORS (Cross-Origin Resource Sharing)
  - dotenv (Environment Variables)
  - Multer (File Upload Handling)

---

## ✨ Features

### Citizen Features
1. **User Authentication**: Login/Register with mobile number
2. **AI Detector**: Upload images for automatic issue detection
3. **Live Map**: View all reported issues on an interactive map
4. **Dashboard**: View statistics and recent reports
5. **Milestones**: Earn badges and track progress on leaderboard
6. **Report Issues**: Confirm AI-detected issues and submit reports

### BBMP Admin Features
1. **Admin Dashboard**: View all reports with statistics
2. **Priority Management**: Reports with multiple votes get higher priority
3. **Overlapping Reports**: Automatically detect and cluster similar reports
4. **Dispatch Engineers**: Assign and track issue resolution
5. **Report Management**: Filter reports by category and status

### AI Features
1. **Garbage Detection**: Identify garbage accumulation using YOLO
2. **Pothole Detection**: Detect potholes in roads using YOLO
3. **Broken Wire Detection**: Identify broken electrical wires using custom PyTorch model
4. **Confidence Scoring**: Show confidence levels for each detection
5. **Severity Assessment**: Automatically assign severity (High/Medium/Low)

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Firebase Account (for full features)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd SmartCityApp
```

### Step 2: Install Frontend Dependencies
```bash
cd client
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd ../server
npm install
```

### Step 4: Install AI Dependencies (Optional)
```bash
cd ../aiModel
pip install torch torchvision ultralytics pillow numpy
```

### Step 5: Environment Setup

#### Frontend (.env in client/)
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### Backend (.env in server/)
```env
PORT=5000
DEMO_MODE=true
```

#### Firebase Service Account (Optional)
Download your Firebase service account key from Firebase Console → Project Settings → Service Accounts, and place it at `server/config/serviceAccountKey.json`

---

## 🚀 Usage

### Running in Demo Mode (No Firebase Required)

1. **Start Backend Server**
```bash
cd server
npm run server
```
The backend will run on http://localhost:5000

2. **Start Frontend Client**
```bash
cd client
npm run dev
```
The frontend will run on http://localhost:3000

### Login Credentials

#### Citizen Login
- Use **any mobile number and password** (demo mode)

#### BBMP Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- Access at: http://localhost:3000/admin/login

---

## 📁 Project Structure

```
SmartCityApp/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/                 # Express Backend
│   ├── routes/            # API routes
│   ├── middleware/        # Middleware
│   └── index.js           # Entry point
├── aiModel/               # AI Models & Training
│   ├── models/            # Trained models
│   └── inference.py       # AI inference
├── .gitignore
└── README.md
```

---

## 🏆 Team

This project was developed for the BMSCE Hackathon by a team of 8 members working on different modules:
- Authentication & User Management
- Dashboard & Statistics
- Live Map Integration
- AI Detector (Garbage, Pothole, Broken Wires)
- Report Management
- Admin Dashboard
- Milestones & Gamification
- Backend & API

---

## 📝 License

This project is for educational purposes and hackathon submission.

---

## 🤝 Contributing

This is a hackathon project, but feel free to fork and use for learning!

---

## 📧 Contact

For any questions, please reach out to the team.

---

**Built with ❤️ for Smart Cities!**
