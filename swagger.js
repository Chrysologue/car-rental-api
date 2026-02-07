const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();
const isProd = process.env.NODE_ENV === 'production';

const PORT = process.env.PORT || 3000;

const doc = {
  info: {
    title: 'Car rental API',
    description: 'Description',
  },
  host: isProd ? process.env.PROD_HOST : `localhost:${PORT}`,

  schemes: isProd ? ['https'] : ['http'],
};

const outputFile = './swagger.json';
const routes = ['server.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
