# AI-Powered Meeting Notes Summarizer

This is a **MERN stack application** that allows users to upload meeting transcripts, generate AI-powered summaries, edit them, and share via email.

---

## 🚀 Features
- Upload meeting transcript (text)
- Provide custom summarization prompt
- Generate AI summary using Groq LLaMA-3 model
- Edit summaries before sharing
- Share summaries via email to multiple recipients
- View all past summaries

---

## 🛠 Tech Stack
- **Frontend:** React (CRA), React Toastify
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **AI API:** Groq SDK (LLaMA-3)
- **Email Service:** Nodemailer (Gmail SMTP or any SMTP)
- **Deployment:** (Render, Vercel)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Manideep-422105/AI-Notes-Summarizer.git
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=4545
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_password_or_app_password
```
Run the backend server:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run start
```

### 4️⃣ Access the App
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4545`

---

## 📤 Deployment
- Deploy backend on **Render**
- Deploy frontend on **Vercel**
- Update API base URL in `frontend/src/api.js`

---

## ✨ Author
Developed by **[Manideep Reddy A]**
