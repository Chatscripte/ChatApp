# Backend - Chatscripte

This is the backend part of the **Chatscripte** project, built with Node.js, Express, and MongoDB.

## Getting Started

Follow the steps below to install dependencies and run the server locally.

---

## 🔧 Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/)
-   [MongoDB](https://www.mongodb.com/) running locally or accessible remotely

---

## 📦 Installation

```bash
# Navigate to the backend folder
cd backend

# Install all dependencies
npm install
```

---

## ⚙️ Environment Variables

Before running the server, create a .env file in the root of the backend folder with the following content:

```env
PORT=3333

DB_URI=mongodb://127.0.0.1:27017/Chatscripte

ACCESS_TOKEN_SECRET_KEY=mdJHga12g13gfaahsgd213123askjsh1yg3adD12Gde45
REFRESH_TOKEN_SECRET_KEY=KsjkhjdH21Vh231skdhaLHsdaiu2312123896

ACCESS_TOKEN_EXPIRES_IN_SECONDS=3600000
REFRESH_TOKEN_EXPIRES_IN_SECONDS=30000000

DOMAIN=http://localhost:3333
NODE_ENV=development
```

---

## 🚀 Starting the Server

To start the development server:

```bash
npm start
```

The server will run at:
http://localhost:3333

---

## 📃 API Document

You can check the API document at: http://localhost:3333/api-doc

---

## 📫 Contact

For any issues or questions, feel free to open an issue or contact the maintainer.

Email: pourya.bu@gmail.com
