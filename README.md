# Car Rental API

This is a REST API for a car rental system.
Users can search for cars, book rentals, and manage their reservations.
Admins can manage cars, locations, users, and rentals.

## What the API Does?

- User registration and login
- Car listing and management
- Rental booking and cancellation
- Location management
- Secure authentication using JWT and OAuth

## Technologies used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- OAuth

## How to run the project?

1. Clone the repository
2. Install dependencies:
   npm install
3. Create a `.env` file and add required environment variables
4. Start the server:
   npm start

## API Endpoints

### Cars

- POST /cars
- GET /cars
- GET /cars/:id
- PUT /cars/:id
- DELETE /cars/:id

### Rentals

- POST /rentals
- GET /rentals
- GET /rentals/:id
- PUT /rentals/:id
- PUT /rentals/:id/cancel
- DELETE /rentals/:id

### Locations

- POST /locations
- GET /locations
- GET /locations/:id
- PUT /locations/:id
- DELETE /locations/:id

### Users

- POST /users
- GET /users
- GET /users/:id
- PUT /users/:id
- DELETE /users/:id

## Team Members

- Milton Kumirai
- John Munina
- Antony Ochieng
- Xyste Chrysologue RABEARSON
- Oluwatobiloba Tolulope Makinde
