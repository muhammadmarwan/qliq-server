# 🚀 QLIQ Server - Express Backend

This is the backend server for the **QLIQ Hackathon Challenge**, built using **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. It powers both the mobile frontend and the admin panel by providing RESTful APIs, real-time updates, and business logic for MLM and eCommerce.

---

## 📦 Features

- ✅ REST API with Express.js
- ✅ MongoDB for data persistence
- ✅ Real-time MLM updates using Socket.IO
- ✅ OpenAPI (Swagger) documentation
- ✅ JWT-based authentication
- ✅ Referral logic for MLM tree
- ✅ eCommerce features: Products, Cart, Orders
- ✅ Mock payment API endpoint
- ✅ Admin endpoints for user & product management
- ✅ Integrated with OpenAI API (optional feature)
- ✅ Test suite via `npm test`
- ✅ Dockerized deployment support
- ✅ GitHub Actions CI/CD pipeline

---

## 📁 Project Structure

qliq-server/
├── src/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── sockets/
│ └── utils/
├── tests/
├── .env
├── Dockerfile
├── openapi.yaml
├── package.json
└── README.md

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/qliq-server.git
cd qliq-server
2. Install Dependencies
bash
Copy
Edit
npm install
3. Set up Environment Variables
Create a .env file in the root with the following content:

env
Copy
Edit
PORT=8000
MONGO_URI=mongodb+srv://marwanmhd1999:j2
PAYMENT_MOCK_API=http://localhost:8000/api/payment/mock
JWT_SECRET=1234567890
OPENAI_API_KEY=sk-proj-RAg0W5XVKiXlI3dcsi6cyo3BlbkFJAFSsk0w2Haa6UEfqViuAONv1Btd85AbXRCnic92Kwh7P
DOCKER_HUB_USERNAME=marwan7771
DOCKER_HUB_TOKEN=dc_patI
⚠️ Security Note: Never commit this .env file to Git. Always store it securely in GitHub Secrets (see below).

🧪 Running Tests
bash
Copy
Edit
npm test
📜 API Documentation
The backend is fully documented using OpenAPI/Swagger.

Docs available at: http://localhost:8000/api-docs

Uses openapi.yaml or inline Swagger JSDoc annotations

You can edit and test via Swagger Editor

🔌 Real-Time Events with Socket.IO
Socket.IO initialized on server boot

Used for emitting MLM tree join updates in real-time

Example event: mlm-joined, new-commission, etc.

🧾 Mock Payment API
Available at /api/payment/mock

Simulates successful or failed payments

Helps simulate the checkout process in development

🧠 OpenAI Integration
API Key: OPENAI_API_KEY

Used for optional AI product recommendations

Available via /api/ai/recommend

🐳 Docker Support
Build Docker Image
bash
Copy
Edit
docker build -t qliq-server .
Run Locally with Docker
bash
Copy
Edit
docker run -p 8000:8000 --env-file .env qliq-server
⚙️ CI/CD with GitHub Actions
GitHub Actions workflow in .github/workflows/ci.yml

Steps:

Install dependencies

Run npm test

Build Docker image

Push to Docker Hub (if secrets are configured)

Required GitHub Repository Secrets
Secret Name	Description
MONGO_URI	Your MongoDB connection string
JWT_SECRET	JWT signing key
OPENAI_API_KEY	Your OpenAI API key
DOCKER_HUB_USERNAME	Docker Hub username
DOCKER_HUB_TOKEN	Docker Hub personal access token

Add these under Settings → Secrets and Variables → Actions in your GitHub repo.

✅ API Endpoints Overview
POST /api/auth/register – Register a new user (with referral logic)

POST /api/auth/login – Login and receive JWT

GET /api/products – List all products

POST /api/cart/add – Add to cart

POST /api/payment/mock – Simulated payment

GET /api/users/:id/tree – Get 3-level MLM tree

GET /api-docs – Swagger docs

🗂 Related Repositories
qliq-app – React Native mobile app

qliq-admin-panel – Admin panel dashboard

🧠 Architecture Diagram
View the complete architecture:
🔗 Eraser Architecture Diagram

👤 Author
Muhammad Marwan
GitHub: @muhammadmarwan