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
admin and user roles. Admins can manage users, cars, and rental locations, while
authenticated users can browse locations, cars, and manage their bookings.
Authentication is handled using Google OAuth 2.0 with JWT tokens.

## Authentication
All protected routes require a JWT token in the Authorization header:
\`Authorization: Bearer <your_jwt_token>\`

## Role-Based Access
- **Public**: Routes accessible without authentication
- **User**: Routes accessible to authenticated users
- **Admin**: Routes accessible only to users with admin role
    `,
    version: '1.0.0',
  },
  host: isProd ? process.env.PROD_HOST : `localhost:${PORT}`,
  basePath: '/api',
  schemes: isProd ? ['https'] : ['http'],

  // Global security definition - this enables the Authorize button at the top
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
      description: 'JWT Authorization header. Enter: Bearer <token>',
    },
  },

  // Global security - this applies to all routes by default
  // Individual routes can override this with an empty array for public routes
  security: [
    {
      BearerAuth: [],
    },
  ],

  tags: [
    {
      name: 'Authentication',
      description: 'Authentication endpoints (Google OAuth) - Public',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Locations',
      description: 'Location management endpoints',
    },
    {
      name: 'Cars',
      description: 'Car management endpoints',
    },
    {
      name: 'Bookings',
      description: 'Booking management endpoints',
    },
    {
      name: 'Public',
      description: 'Public endpoints (no authentication required)',
    },
  ],
  paths: {
    // ================== PUBLIC ENDPOINTS ==================
    '/': {
      get: {
        tags: ['Public'],
        summary: 'Home endpoint',
        description: 'Public home endpoint',
        security: [], // Override global security - this route is public (no padlock)
        responses: {
          200: { description: 'OK' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    // ================== AUTHENTICATION ENDPOINTS ==================
    // '/auth/login': {
    //   get: {
    //     tags: ['Authentication'],
    //     summary: 'Google OAuth Login',
    //     description: 'Initiate Google OAuth login flow',
    //     security: [], // Public route (no padlock)
    //     responses: {
    //       302: {
    //         description: 'Redirect to Google OAuth consent screen',
    //         headers: {
    //           Location: {
    //             description: 'Google OAuth URL',
    //             type: 'string',
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    // '/auth/google/callback': {
    //   get: {
    //     tags: ['Authentication'],
    //     summary: 'Google OAuth Callback',
    //     description:
    //       'Google OAuth callback endpoint - returns JWT token on success',
    //     security: [], // Public route (no padlock)
    //     responses: {
    //       200: {
    //         description: 'Authentication successful - returns JWT token',
    //         schema: {
    //           type: 'object',
    //           properties: {
    //             success: { type: 'boolean' },
    //             token: { type: 'string' },
    //             user: {
    //               type: 'object',
    //               properties: {
    //                 _id: { type: 'string' },
    //                 email: { type: 'string' },
    //                 name: { type: 'string' },
    //                 role: { type: 'string' },
    //               },
    //             },
    //           },
    //         },
    //       },
    //       401: { description: 'Authentication failed' },
    //       500: { description: 'Internal Server Error' },
    //     },
    //   },
    // },
    // ================== USER ENDPOINTS ==================
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        description: 'Retrieve all users (Admin only) - 🔒 Protected Route',
        // No security override - uses global security (shows padlock)
        responses: {
          200: {
            description: 'Success',
            schema: {
              type: 'array',
              items: { $ref: '#/definitions/User' },
            },
          },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          500: { description: 'Internal Server Error' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create user',
        description: 'Create a new user (Public)',
        security: [], // Public route (no padlock)
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/UserInput' },
          },
        ],
        responses: {
          201: {
            description: 'User created successfully',
            schema: { $ref: '#/definitions/User' },
          },
          400: { description: 'Bad Request - Invalid input data' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        description:
          'Retrieve a specific user (User can access own profile, Admin can access any) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'User ID',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: { $ref: '#/definitions/User' },
          },
          400: { description: 'Bad Request - Invalid ID format' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: {
            description: "Forbidden - Cannot access other users' profiles",
          },
          404: { description: 'User not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user',
        description:
          'Update user information (User can update own profile, Admin can update any) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'User ID',
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/UserInput' },
          },
        ],
        responses: {
          200: {
            description: 'User updated successfully',
            schema: { $ref: '#/definitions/User' },
          },
          400: { description: 'Bad Request - Invalid input data' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Cannot update other users' },
          404: { description: 'User not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        description: 'Delete a user (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'User ID',
          },
        ],
        responses: {
          200: {
            description: 'User deleted successfully',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
          400: { description: 'Bad Request - Invalid ID format' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          404: { description: 'User not found' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    // ================== LOCATION ENDPOINTS ==================
    '/locations': {
      get: {
        tags: ['Locations'],
        summary: 'Get all locations',
        description: 'Retrieve all rental locations (Public)',
        security: [], // Public route (no padlock)
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'array',
              items: { $ref: '#/definitions/Location' },
            },
          },
          500: { description: 'Internal Server Error' },
        },
      },
      post: {
        tags: ['Locations'],
        summary: 'Create location',
        description:
          'Create a new rental location (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/LocationInput' },
          },
        ],
        responses: {
          201: {
            description: 'Location created successfully',
            schema: { $ref: '#/definitions/Location' },
          },
          400: { description: 'Bad Request - Invalid input data' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/locations/{id}': {
      get: {
        tags: ['Locations'],
        summary: 'Get location by ID',
        description: 'Retrieve a specific rental location (Public)',
        security: [], // Public route (no padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Location ID',
          },
        ],
        responses: {
          200: {
            description: 'Success',
            schema: { $ref: '#/definitions/Location' },
          },
          400: { description: 'Bad Request - Invalid ID format' },
          404: { description: 'Location not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      put: {
        tags: ['Locations'],
        summary: 'Update location',
        description:
          'Update a rental location (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Location ID',
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/LocationInput' },
          },
        ],
        responses: {
          200: {
            description: 'Location updated successfully',
            schema: { $ref: '#/definitions/Location' },
          },
          400: { description: 'Bad Request - Invalid input data' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          404: { description: 'Location not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      delete: {
        tags: ['Locations'],
        summary: 'Delete location',
        description:
          'Delete a rental location (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Location ID',
          },
        ],
        responses: {
          200: {
            description: 'Location deleted successfully',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
          400: { description: 'Bad Request - Invalid ID format' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          404: { description: 'Location not found' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    // ================== CARS ENDPOINTS ==================
    '/cars': {
      get: {
        tags: ['Cars'],
        summary: 'Get all cars',
        description: 'Retrieve all available cars (Public)',
        security: [], // Public route (no padlock)
        parameters: [
          {
            name: 'location',
            in: 'query',
            required: false,
            type: 'string',
            description: 'Filter cars by location ID',
          },
          {
            name: 'type',
            in: 'query',
            required: false,
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
            description: 'Filter cars by type',
          },
          {
            name: 'minPrice',
            in: 'query',
            required: false,
            type: 'number',
            description: 'Minimum price per day',
          },
          {
            name: 'maxPrice',
            in: 'query',
            required: false,
            type: 'number',
            description: 'Maximum price per day',
          },
        ],
        responses: {
          200: {
            description: 'Success',
            schema: {
              type: 'array',
              items: { $ref: '#/definitions/Car' },
            },
          },
          500: { description: 'Internal Server Error' },
        },
      },
      post: {
        tags: ['Cars'],
        summary: 'Create car',
        description:
          'Create a new car listing (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/CarInput' },
          },
        ],
        responses: {
          201: {
            description: 'Car created successfully',
            schema: { $ref: '#/definitions/Car' },
          },
          400: { description: 'Bad Request - Invalid input data' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/cars/{id}': {
      get: {
        tags: ['Cars'],
        summary: 'Get car by ID',
        description: 'Retrieve a specific car (Public)',
        security: [], // Public route (no padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Car ID',
          },
        ],
        responses: {
          200: {
            description: 'Success',
            schema: { $ref: '#/definitions/Car' },
          },
          400: { description: 'Bad Request - Invalid ID format' },
          404: { description: 'Car not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      put: {
        tags: ['Cars'],
        summary: 'Update car',
        description: 'Update car information (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Car ID',
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/CarInput' },
          },
        ],
        responses: {
          200: {
            description: 'Car updated successfully',
            schema: { $ref: '#/definitions/Car' },
          },
          400: { description: 'Bad Request - Invalid input data' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          404: { description: 'Car not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      delete: {
        tags: ['Cars'],
        summary: 'Delete car',
        description: 'Delete a car listing (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Car ID',
          },
        ],
        responses: {
          200: {
            description: 'Car deleted successfully',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          404: { description: 'Car not found' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    // ================== BOOKING ENDPOINTS ==================
    '/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'Get all bookings',
        description: 'Retrieve all bookings (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        responses: {
          200: {
            description: 'Success',
            schema: {
              type: 'array',
              items: { $ref: '#/definitions/Booking' },
            },
          },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          500: { description: 'Internal Server Error' },
        },
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create booking',
        description:
          'Create a new booking (Authenticated users only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/BookingInput' },
          },
        ],
        responses: {
          201: {
            description: 'Booking created successfully',
            schema: { $ref: '#/definitions/Booking' },
          },
          400: { description: 'Bad Request - Invalid input data' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          404: { description: 'Car or location not found' },
          409: {
            description: 'Conflict - Car not available for selected dates',
          },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/bookings/{id}': {
      get: {
        tags: ['Bookings'],
        summary: 'Get booking by ID',
        description:
          'Retrieve a specific booking (User can access own bookings, Admin can access any) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Booking ID',
          },
        ],
        responses: {
          200: {
            description: 'Success',
            schema: { $ref: '#/definitions/Booking' },
          },
          400: { description: 'Bad Request - Invalid ID format' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: {
            description: "Forbidden - Cannot access other users' bookings",
          },
          404: { description: 'Booking not found' },
          500: { description: 'Internal Server Error' },
        },
      },
      put: {
        tags: ['Bookings'],
        summary: 'Update booking',
        description:
          'Update booking information (User can update own bookings, Admin can update any) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Booking ID',
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/BookingInput' },
          },
        ],
        responses: {
          200: {
            description: 'Booking updated successfully',
            schema: { $ref: '#/definitions/Booking' },
          },
          400: { description: 'Bad Request - Invalid input data' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: {
            description: "Forbidden - Cannot update other users' bookings",
          },
          404: { description: 'Booking not found' },
          409: {
            description: 'Conflict - Cannot modify booking in current status',
          },
          500: { description: 'Internal Server Error' },
        },
      },
      delete: {
        tags: ['Bookings'],
        summary: 'Delete booking',
        description: 'Delete a booking (Admin only) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Booking ID',
          },
        ],
        responses: {
          200: {
            description: 'Booking deleted successfully',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
          400: { description: 'Bad Request - Invalid ID format' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: { description: 'Forbidden - Admin access required' },
          404: { description: 'Booking not found' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
    '/bookings/user/{userId}': {
      get: {
        tags: ['Bookings'],
        summary: 'Get user bookings',
        description:
          'Retrieve all bookings for a specific user (User can access own bookings, Admin can access any) - 🔒 Protected Route',
        // Uses global security (shows padlock)
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            type: 'string',
            description: 'User ID',
          },
          {
            name: 'status',
            in: 'query',
            required: false,
            type: 'string',
            enum: [
              'pending',
              'confirmed',
              'active',
              'completed',
              'cancelled',
              'no-show',
            ],
            description: 'Filter bookings by status',
          },
        ],
        responses: {
          200: {
            description: 'Success',
            schema: {
              type: 'array',
              items: { $ref: '#/definitions/Booking' },
            },
          },
          400: { description: 'Bad Request - Invalid ID format' },
          401: { description: 'Unauthorized - Missing or invalid token' },
          403: {
            description: "Forbidden - Cannot access other users' bookings",
          },
          404: { description: 'User not found' },
          500: { description: 'Internal Server Error' },
        },
      },
    },
  },
  definitions: {
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        googleId: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        role: {
          type: 'string',
          enum: ['user', 'admin'],
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    UserInput: {
      type: 'object',
      required: ['email', 'name', 'googleId'],
      properties: {
        googleId: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        role: {
          type: 'string',
          enum: ['user', 'admin'],
        },
      },
    },
    Location: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        address: { type: 'string' },
        country: { type: 'string' },
        city: { type: 'string' },
        contactNumber: { type: 'string' },
        email: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    LocationInput: {
      type: 'object',
      required: ['name', 'address', 'country', 'city', 'contactNumber'],
      properties: {
        name: { type: 'string' },
        address: { type: 'string' },
        country: { type: 'string' },
        city: { type: 'string' },
        contactNumber: { type: 'string' },
        email: { type: 'string' },
      },
    },
    Car: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        make: { type: 'string' },
        model: { type: 'string' },
        year: { type: 'integer' },
        licensePlate: { type: 'string' },
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
        },
        color: { type: 'string' },
        seats: { type: 'integer' },
        transmission: {
          type: 'string',
          enum: ['automatic', 'manual'],
        },
        fuelType: {
          type: 'string',
          enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
        },
        isBooked: { type: 'boolean' },
        mileage: { type: 'number' },
        location: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            city: { type: 'string' },
          },
        },
        status: {
          type: 'string',
          enum: ['available', 'rented', 'maintenance', 'unavailable'],
        },
        pricePerDay: { type: 'number' },
        features: {
          type: 'array',
          items: { type: 'string' },
        },
        images: {
          type: 'array',
          items: { type: 'string' },
        },
        description: {
          type: 'string',
        },
        totalRentals: { type: 'integer' },
        averageRating: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    CarInput: {
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
        make: { type: 'string' },
        model: { type: 'string' },
        year: { type: 'integer', minimum: 2000 },
        licensePlate: { type: 'string' },
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
        },
        color: { type: 'string' },
        seats: { type: 'integer', minimum: 2, maximum: 15 },
        transmission: {
          type: 'string',
          enum: ['automatic', 'manual'],
        },
        fuelType: {
          type: 'string',
          enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
        },
        mileage: { type: 'number', minimum: 0 },
        location: {
          type: 'string',
          description: 'Location ID',
        },
        status: {
          type: 'string',
          enum: ['available', 'rented', 'maintenance', 'unavailable'],
        },
        pricePerDay: { type: 'number', minimum: 0 },
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
        },
        images: {
          type: 'array',
          items: { type: 'string' },
        },
        description: {
          type: 'string',
          maxLength: 500,
        },
      },
    },
    Booking: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
        car: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            licensePlate: { type: 'string' },
          },
        },
        pickupLocation: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        returnLocation: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        pickupDate: { type: 'string', format: 'date-time' },
        returnDate: { type: 'string', format: 'date-time' },
        duration: { type: 'number' },
        dailyRate: { type: 'number' },
        totalAmount: { type: 'number' },
        paidAmount: { type: 'number' },
        securityDeposit: { type: 'number' },
        insuranceOption: {
          type: 'string',
          enum: ['basic', 'premium', 'full'],
        },
        status: {
          type: 'string',
          enum: [
            'pending',
            'confirmed',
            'active',
            'completed',
            'cancelled',
            'no-show',
          ],
        },
        paymentStatus: {
          type: 'string',
          enum: ['pending', 'paid', 'partially-paid', 'refunded', 'failed'],
        },
        paymentMethod: {
          type: 'string',
          enum: [
            'credit-card',
            'debit-card',
            'paypal',
            'cash',
            'bank-transfer',
          ],
        },
        bookingNumber: { type: 'string' },
        specialRequests: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    BookingInput: {
      type: 'object',
      required: [
        'car',
        'pickupLocation',
        'returnLocation',
        'pickupDate',
        'returnDate',
        'dailyRate',
        'totalAmount',
      ],
      properties: {
        car: { type: 'string' },
        pickupLocation: { type: 'string' },
        returnLocation: { type: 'string' },
        pickupDate: { type: 'string', format: 'date-time' },
        returnDate: { type: 'string', format: 'date-time' },
        dailyRate: { type: 'number' },
        totalAmount: { type: 'number' },
        paidAmount: { type: 'number' },
        securityDeposit: { type: 'number' },
        insuranceOption: {
          type: 'string',
          enum: ['basic', 'premium', 'full'],
        },
        paymentMethod: {
          type: 'string',
          enum: [
            'credit-card',
            'debit-card',
            'paypal',
            'cash',
            'bank-transfer',
          ],
        },
        drivers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              licenseNumber: { type: 'string' },
              licenseExpiry: { type: 'string', format: 'date' },
              dateOfBirth: { type: 'string', format: 'date' },
            },
          },
        },
        specialRequests: { type: 'string', maxLength: 500 },
        promotionCode: { type: 'string' },
        loyaltyPointsUsed: { type: 'number' },
      },
    },
  },
};

fs.writeFileSync('./swagger.json', JSON.stringify(doc, null, 2));
console.log('✅ Swagger documentation generated successfully');
