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
    // ================== CARS ENDPOINTS ==================
    '/api/cars': {
      get: {
        description: 'Get all cars',
        security: [],
        responses: {
          200: { description: 'Success' },
          500: { description: 'Internal Server Error' },
        },
      },
      post: {
        description: 'Create a new car (admin only)',
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/Car' },
          },
        ],
        responses: {
          201: { description: 'Car created successfully' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Admin access required' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/api/cars/{id}': {
      get: {
        description: 'Get car by ID',
        security: [],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: { description: 'Success' },
          400: { description: 'Bad Request' },
          404: { description: 'Car not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      put: {
        description: 'Update car (admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/Car' },
          },
        ],
        responses: {
          200: { description: 'Car updated successfully' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Admin access required' },
          404: { description: 'Car not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      delete: {
        description: 'Delete car (admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: { description: 'Car deleted successfully' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Admin access required' },
          404: { description: 'Car not found' },
          500: { description: 'Internal Server Error' },
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
    // ================== CAR DEFINITION ==================
    Car: {
      type: 'object',
      required: [
        'make',
        'model',
        'year',
        'licensePlate',
        'color',
        'seats',
        'mileage',
        'location',
        'pricePerDay',
      ],
      properties: {
        make: {
          type: 'string',
          example: 'Toyota',
          description: 'Car manufacturer/brand',
        },
        model: {
          type: 'string',
          example: 'Camry',
          description: 'Car model',
        },
        year: {
          type: 'integer',
          example: 2023,
          minimum: 2000,
          maximum: 2026,
          description: 'Manufacturing year (2000-present)',
        },
        licensePlate: {
          type: 'string',
          example: 'ABC-123',
          description: 'License plate number (must be unique)',
        },
        type: {
          type: 'string',
          enum: [
            'economy',
            'compact',
            'midsize',
            'suv',
            'van',
            'luxury',
            'sports',
          ],
          example: 'midsize',
          default: 'midsize',
          description: 'Car category/type',
        },
        color: {
          type: 'string',
          example: 'White',
          description: 'Car color',
        },
        seats: {
          type: 'integer',
          example: 5,
          minimum: 2,
          maximum: 15,
          description: 'Number of seats',
        },
        transmission: {
          type: 'string',
          enum: ['automatic', 'manual'],
          example: 'automatic',
          default: 'automatic',
          description: 'Transmission type',
        },
        fuelType: {
          type: 'string',
          enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
          example: 'gasoline',
          default: 'gasoline',
          description: 'Type of fuel',
        },
        mileage: {
          type: 'number',
          example: 15000,
          minimum: 0,
          description: 'Current mileage in km/miles',
        },
        location: {
          type: 'string',
          example: '507f1f77bcf86cd799439011',
          description: 'Location ID where the car is available',
        },
        status: {
          type: 'string',
          enum: ['available', 'rented', 'maintenance', 'unavailable'],
          example: 'available',
          default: 'available',
          description: 'Current status of the car',
        },
        pricePerDay: {
          type: 'number',
          example: 49.99,
          minimum: 0,
          description: 'Daily rental price',
        },
        features: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'gps',
              'bluetooth',
              'backup-camera',
              'sunroof',
              'heated-seats',
              'child-seat',
            ],
          },
          example: ['gps', 'bluetooth', 'backup-camera'],
          description: 'Car features and amenities',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: [
            'https://example.com/car1.jpg',
            'https://example.com/car2.jpg',
          ],
          description: 'Array of image URLs for the car',
        },
        description: {
          type: 'string',
          maxLength: 500,
          example: 'A comfortable midsize sedan with modern features',
          description: 'Description of the car',
        },
        totalRentals: {
          type: 'integer',
          example: 0,
          default: 0,
          description: 'Total number of times this car has been rented',
        },
        averageRating: {
          type: 'number',
          minimum: 0,
          maximum: 5,
          example: 0,
          default: 0,
          description: 'Average customer rating (0-5)',
        },
      },
    },
  },
};

fs.writeFileSync('./swagger.json', JSON.stringify(doc, null, 2));
console.log('✅ Success');
