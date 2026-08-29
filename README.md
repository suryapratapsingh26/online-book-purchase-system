# Online Book Purchase & Download System

A full-stack online book-selling application where users can browse books, purchase them using Razorpay's test payment environment, and download books after successful payment verification.

## Features

- User registration and login
- Authentication and authorization
- Display 30 books
- Book details including cover, title, author, description, and price
- Purchase books through Razorpay test mode
- Payment order creation
- Payment verification
- Purchase and payment records
- Users can access purchased books after successful payment
- Secure book download access
- Responsive UI
- Form validation and error handling

## Tech Stack

### Frontend

- React
- TypeScript
- Material UI
- Redux Toolkit
- RTK Query

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

### Other Tools

- Razorpay Test Mode
- JWT Authentication
- bcrypt
- Zod
- React Hook Form

## Application Flow

```text
Register/Login
      ↓
View 30 Books
      ↓
Select Book
      ↓
Buy Now
      ↓
Create Payment Order
      ↓
Complete Payment Using Razorpay Test Mode
      ↓
Verify Payment
      ↓
Create Purchase Record
      ↓
Download Purchased Book
