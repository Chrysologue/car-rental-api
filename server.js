const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // 1. Import CORS
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Routers
const carRouter = require('./routes/carRoutes.js');
const bookingsRouter = require('./routes/bookingRoutes.js');
const locationRouter = require('./routes/locationRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');

// Database
const { connectToDB } = require('./config/database.js');

dotenv.config();
const app = express();

// Middleware
app.use(cors()); // 2. Enable CORS for all origins
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/cars', carRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/locations', locationRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// Root
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Car Rental API',
    api_docs: `${req.protocol}://${req.get('host')}/api-docs`,
  });
});

// Start server
const PORT = process.env.PORT || 4400;
connectToDB()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));