const bookingsRouter = require('./routes/bookingRoutes.js');
const { connectToDB } = require('./config/database.js');
const locationRoute = require('./routes/locationRoutes.js');
const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoute = require('./routes/authRoutes.js');
const passport = require('passport');
require('./config/passport.js');

const userRoutes = require('./routes/userRoutes.js');
const carRouter = require('./routes/carRoutes.js');

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', locationRoute);
app.use('/api', authRoute);
app.use('/api', userRoutes);
app.use('/api/bookings', bookingsRouter);
app.use('/api/cars', carRouter);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Car Rental API</title>
    </head>
    <body>
      <h1>Welcome to Car Rental API</h1>
      <p>
        API Documentation: 
        <a href="https://car-rental-api-d7zw.onrender.com/api-docs" target="_blank">
          https://car-rental-api-d7zw.onrender.com/api-docs
        </a>
      </p>
      <p>
        Login with Google: 
        <a href="https://car-rental-api-d7zw.onrender.com/api/auth/login" target="_blank">
          Log in with Google
        </a>
      </p>
    </body>
    </html>
  `);
});

const port = process.env.PORT || 3000;

connectToDB().then(() => {
  app.listen(port, () => console.log('Listening on port', port));
});
