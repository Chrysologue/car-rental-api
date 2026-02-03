const express = require('express');
const dotenv = require('dotenv');
const { connectToDB } = require('./config/database.js');
const locationRoute = require('./routes/locationRoutes.js');
const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', locationRoute);

app.get('/', (req, res) => {
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.status(200).json({
    message: 'Welcome to Car Rental API',
  });
});

const PORT = process.env.PORT || 3000;

const appInit = async () => {
  await connectToDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

appInit();
