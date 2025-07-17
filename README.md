# MLM & eCommerce Backend API

## Overview

This project is a backend API for a dynamic Multi-Level Marketing (MLM) platform integrated with a mini eCommerce flow.  
It features a real-time 3-level MLM user tree, product listing, cart and checkout, mock payment simulation, an admin panel, referral code system, and AI-powered product suggestions using OpenAI.

---

## Architecture

![Project Architecture](https://app.eraser.io/workspace/TanO9qri00NQvVpQYtrc?origin=share)

The architecture diagram above illustrates the core components and data flow:

- User authentication & referral system  
- Real-time MLM tree updates using Socket.IO  
- Product and cart management  
- Payment simulation via a mock payment API  
- AI-powered product recommendation with OpenAI  
- Admin panel for managing users, commissions, and products  
- Dockerized service for easy deployment  
- CI/CD pipeline with GitHub Actions  

---

## Tech Stack

- **Backend:** Node.js with Express  
- **Database:** MongoDB (Atlas)  
- **Real-time:** Socket.IO  
- **Validation:** Zod (npm)  
- **AI:** OpenAI API for product recommendations  
- **Testing:** Jest & npm test scripts  
- **Deployment:** Docker & GitHub Actions for CI/CD  
- **API Documentation:** Postman  

---

## Features

- Dynamic MLM user tree (3 levels deep) with real-time join notifications  
- Referral code system to link new users to referrers  
- Product listing, shopping cart, and checkout flow  
- Mock payment API simulating payment processing  
- AI-based product suggestions integrated using OpenAI  
- Admin panel to view users, commissions, and manage products  
- Comprehensive validation with Zod schemas  
- Full test coverage with automated tests  
- Dockerized backend for consistent environment setup  
- Automated CI/CD pipeline on GitHub Actions  

---

## Setup & Run Instructions

### Prerequisites

- Node.js v18+  
- Docker (optional, for containerized deployment)  
- MongoDB Atlas or local MongoDB instance  

---

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
MONGO_URI=mongodb+srv://marwanmhd1999:j28yso41.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PAYMENT_MOCK_API=http://localhost:8000/api/payment/mock
JWT_SECRET=1234567890
OPENAI_API_KEY=sk-proj-RfAHPlPNoeAg0W5XVKiXlI3dcsi6cyoWbdgWsyyl8FSsk0w2Haa6UEfqViuAONv1Btd85AbXRCnic92Kwh7P5T-TUn-z8MA
Installation & Running Locally
bash
Copy
Edit
# Install dependencies
npm ci

# Run tests
npm test

# Start the server
npm run start
Using Docker
Build and run the container locally:

bash
Copy
Edit
# Build the Docker image
docker build -t qliq-server .

# Run the Docker container
docker run -p 8000:8000 --env-file .env qliq-server
API Documentation
Explore the full API endpoints and test requests with Postman:
Postman Collection

Testing
Run the test suite with:

bash
Copy
Edit
npm test
Tests cover validation, core business logic, and API routes.

Challenges & Solutions
Dependency conflicts: Resolved peer dependency issues between openai and zod by using npm ci --legacy-peer-deps in CI pipeline.

Real-time updates: Implemented Socket.IO to keep MLM tree synchronized on user joins in real-time.

Payment simulation: Designed a mock payment API that mimics real payment behavior without external dependency.

AI integration: Used OpenAI's GPT API to provide intelligent product recommendations, improving user experience.

Deployment & CI/CD: Dockerized the app and automated testing, building, and deployment with GitHub Actions for consistent delivery.

Code Quality
Well-structured with modular routes, controllers, and services

Zod schemas ensure strong input validation

Meaningful, documented code with JSDoc comments

CI pipeline runs automated tests and linting on every push/pull request

Contact
Muhammad Marwan
Email: marwan@example.com
GitHub: https://github.com/muhammadmarwan

Thank you for reviewing my submission! Looking forward to your feedback.