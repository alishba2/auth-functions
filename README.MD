# User Authentication with Email Verification using SendGrid

## 🚀 Project Overview
This project implements **User Authentication** using **Node.js, Express, MongoDB, Mongoose, Zod, Jest, and SendGrid**. It includes:
- **User Registration** with hashed passwords
- **Email Verification** using **SendGrid**
- **User Login** (only after email verification)
- **Secure API with validation** using **Zod**
- **Unit testing** with **Jest**

---

## 📌 Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Backend framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Zod** - Schema validation
- **Bcrypt.js** - Password hashing
- **SendGrid** - Email service
- **Jest** - Unit testing

---

## 🔧 Installation & Setup

### 1️⃣ Clone Repository
```sh
git clone https://github.com/your-repo/auth-project.git
cd auth-project
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_email@example.com
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Start the Server
```sh
npm run dev
```
The API runs on **http://localhost:5000**

---

## 📌 API Endpoints

### **1️⃣ Register User**
- **Endpoint:** `POST /api/users/register`
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "StrongPass123"
}
```
- **Response:**
```json
{
  "message": "User registered! Check your email for verification."
}
```
🔹 **Sends a verification email** to the user.

### **2️⃣ Verify Email**
- **Endpoint:** `GET /api/users/verify/:token`
- **Response:**
```json
{
  "message": "Email verified successfully!"
}
```
🔹 **Activates the user's account.**

### **3️⃣ Login User**
- **Endpoint:** `POST /api/users/login`
- **Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "StrongPass123"
}
```
- **Response (if not verified):**
```json
{
  "message": "Please verify your email first."
}
```
- **Response (if verified):**
```json
{
  "message": "Login successful!"
}
```

---

## 🛠 Running Tests
Run Jest tests:
```sh
npm test
```

---

## 📌 Folder Structure
```
/auth-project
│── src
│   ├── controllers
│   │   ├── user.ts
│   ├── models
│   │   ├── User.ts
│   ├── routes
│   │   ├── user.ts
│   ├── utils
│   │   ├── sendEmail.ts
│   ├── tests
│   │   ├── user.test.ts
│   ├── index.ts
│── .env
│── package.json
│── README.md
```

---

## 🚀 Future Improvements
✅ Add **JWT Authentication**
✅ Implement **Password Reset**
✅ Improve **Validation with Zod**

---

## 💡 Contributing
Feel free to contribute! Fork the repo, create a branch, and submit a PR. 🚀

---

## 📝 License
This project is **MIT Licensed**.

