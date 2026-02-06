const bookingsRouter = require('./routes/bookingRoutes.js');
const { connectToDB } = require('./config/database.js');
const locationRoute = require('./routes/locationRoutes.js');
const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoute = require('./routes/authRoutes.js');

const userRoutes = require('./routes/userRoutes.js');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', locationRoute);
app.use('/api', authRoute);
app.use('/api', userRoutes);
app.use('/api/bookings', bookingsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Car Rental API',
  });
});

const port = process.env.PORT || 3000;

connectToDB().then(() => {
  app.listen(port, () => console.log('Listening on port', port));
});
