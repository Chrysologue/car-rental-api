// const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();
const isProd = process.env.NODE_ENV === 'production';
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const doc = {
  swagger: '2.0',
  info: {
    title: 'Car rental API',
    description: `
A RESTful Car Rental API that allows users to register, authenticate, and rent cars
from different locations. The system supports role-based access control with
admin and user roles. Admins can manage users and rental locations, while
authenticated users can browse locations and perform rental-related operations.
Authentication is handled using JWT Bearer tokens.
    `,
    version: '1.0.0',
  },
  host: isProd ? process.env.PROD_HOST : `localhost:${PORT}`,

  schemes: isProd ? ['https'] : ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
      description: 'Authorization needed, Enter: Bearer<token>',
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/': {
      get: {
        description: 'public Home',
        security: [],
        responses: {
          200: { description: 'Ok' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/api/login': {
      post: {
        description: 'Login',
        security: [],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', example: 'User@example.com' },
                password: { type: 'string', example: 'Your password' },
              },
            },
          },
        ],
        responses: {
          200: { description: 'Success' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/api/users': {
      get: {
        description: 'Get all user (admin only)',
        responses: {
          200: { description: 'Success' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          500: { description: 'Internal Server Error' },
        },
      },
      post: {
        description: 'Create user',
        security: [],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/User' },
          },
        ],
        responses: {
          201: { description: 'Created' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidded' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        description: 'Get user',
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: {
          200: { description: 'Ok' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidded' },
          404: { description: 'Not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      delete: {
        description: 'Delete user',
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: {
          200: { description: 'SUccess' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidded' },
          404: { description: 'Not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      put: {
        description: 'Update user user',
        parameters: [
          { name: 'id', in: 'path', required: true },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/User' },
          },
        ],
        responses: {
          200: { description: 'SUccess' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidded' },
          404: { description: 'Not found' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/api/locations': {
      get: {
        description: 'Get all locations',
        security: [],
        responses: {
          200: { description: 'Ok' },
        },
      },
      post: {
        description: 'Create user (admin only)',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: 'true',
            schema: { $ref: '#/definitions/Location' },
          },
        ],
        responses: {
          201: { description: 'created' },
          200: { description: 'Success' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/api/locations/{id}': {
      get: {
        description: 'Get location by id',
        security: [],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: 'true',
          },
        ],
        responses: {
          200: { description: 'Success' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      delete: {
        description: 'Delete location (admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: 'true',
          },
        ],
        responses: {
          200: { description: 'Success' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      put: {
        description: 'Update location',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/Location' },
          },
        ],
        responses: {
          200: { description: 'Location updated' },
          404: { description: 'Location not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
  },
  definitions: {
    Location: {
      type: 'object',
      required: [
        'name',
        'address',
        'country',
        'city',
        'contactNumber',
        'email',
      ],
      properties: {
        name: { type: 'string', example: 'Yourname' },
        address: { type: 'string', example: '2-15 Shinjuku Avenue' },
        country: { type: 'string', example: 'Japan' },
        city: { type: 'string', example: 'Tokyo' },
        contactNumber: { type: 'string', example: '+81-3-5555-1122' },
        email: { type: 'string', example: 'contact@tokyodrive.jp' },
      },
    },
    User: {
      type: 'object',
      required: ['email', 'name', 'password', 'role'],
      properties: {
        email: { type: 'string', example: 'User@example.com' },
        name: { type: 'string', example: 'Yourname' },
        password: { type: 'string', example: 'Your password' },
        role: { type: 'string', example: 'user' },
      },
    },
  },
};

fs.writeFileSync('./swagger.json', JSON.stringify(doc, null, 2));
console.log('✅ Success');
// const outputFile = './swagger.json';
// const routes = ['server.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

// swaggerAutogen(outputFile, routes, doc);
