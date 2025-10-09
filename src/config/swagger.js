import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PP Backend API',
      version: '1.0.0',
      description: 'Express server for PP application - Creator management API',
      contact: {
        name: 'API Support',
        email: 'support@pp.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? (process.env.API_BASE_URL || 'https://pp-backend.apextip.space/')
          : 'http://localhost:8000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      },
      ...(process.env.NODE_ENV !== 'production' ? [{
        url: 'http://localhost:8000',
        description: 'Development server'
      }] : [])
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Common reusable schemas
        ImageObject: {
          type: 'object',
          properties: {
            src: {
              type: 'string',
              format: 'uri',
              description: 'Image URL'
            }
          }
        },
        ColorScheme: {
          type: 'object',
          properties: {
            primary: {
              type: 'string',
              format: 'color',
              default: '#3734eb',
              description: 'Primary color'
            },
            secondary: {
              type: 'string',
              format: 'color',
              default: '#10b981',
              description: 'Secondary color'
            },
            accent: {
              type: 'string',
              format: 'color',
              default: '#8b5cf6',
              description: 'Accent color'
            },
            muted: {
              type: 'string',
              format: 'color',
              default: '#f9fafb',
              description: 'Muted color'
            },
            warning: {
              type: 'string',
              format: 'color',
              default: '#f59e0b',
              description: 'Warning color'
            },
            success: {
              type: 'string',
              format: 'color',
              default: '#10b981',
              description: 'Success color'
            },
            error: {
              type: 'string',
              format: 'color',
              default: '#ef4444',
              description: 'Error color'
            }
          }
        },
        Timestamps: {
          type: 'object',
          properties: {
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        MongoDBObjectId: {
          type: 'string',
          description: 'MongoDB ObjectId',
          pattern: '^[0-9a-fA-F]{24}$',
          example: '507f1f77bcf86cd799439011'
        },
        
        // Main entity schemas
        Creator: {
          type: 'object',
          properties: {
            _id: {
              $ref: '#/components/schemas/MongoDBObjectId'
            },
            creator_id: {
              type: 'string',
              description: 'Short unique creator identifier',
              pattern: '^[a-f0-9]{8}$',
              example: 'a1b2c3d4'
            },
            username: {
              type: 'string',
              description: 'Unique username',
              minLength: 3,
              maxLength: 30,
              pattern: '^[a-zA-Z0-9_]+$',
              example: 'john_doe'
            },
            firstName: {
              type: 'string',
              description: 'First name',
              minLength: 2,
              maxLength: 50,
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Last name',
              minLength: 2,
              maxLength: 50,
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john.doe@example.com'
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              pattern: '^\\+?[\\d\\s\\-\\(\\)]+$',
              example: '+1234567890'
            },
            approved: {
              type: 'boolean',
              description: 'Creator approval status',
              default: false,
              example: false
            },
            config: {
              $ref: '#/components/schemas/Config'
            },
            image: {
              $ref: '#/components/schemas/ImageObject'
            },
            banner_image: {
              $ref: '#/components/schemas/ImageObject'
            }
          },
          allOf: [
            { $ref: '#/components/schemas/Timestamps' }
          ]
        },
        Config: {
          type: 'object',
          properties: {
            _id: {
              $ref: '#/components/schemas/MongoDBObjectId'
            },
            colors: {
              $ref: '#/components/schemas/ColorScheme'
            }
          },
          allOf: [
            { $ref: '#/components/schemas/Timestamps' }
          ]
        },
        SignupRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Unique username',
              minLength: 3,
              maxLength: 30,
              pattern: '^[a-zA-Z0-9_]+$',
              example: 'john_doe'
            },
            firstName: {
              type: 'string',
              description: 'First name',
              minLength: 2,
              maxLength: 50,
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Last name',
              minLength: 2,
              maxLength: 50,
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              description: 'Password (min 8 chars, must contain uppercase, lowercase, and number)',
              minLength: 8,
              maxLength: 100,
              example: 'Password123'
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              pattern: '^\\+?[\\d\\s\\-\\(\\)]+$',
              example: '+1234567890'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['emailOrUsername', 'password'],
          properties: {
            emailOrUsername: {
              type: 'string',
              description: 'Email address or username',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              description: 'Password',
              example: 'Password123'
            }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Username',
              minLength: 3,
              maxLength: 30,
              pattern: '^[a-zA-Z0-9_]+$',
              example: 'john_doe_updated'
            },
            firstName: {
              type: 'string',
              description: 'First name',
              minLength: 2,
              maxLength: 50,
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Last name',
              minLength: 2,
              maxLength: 50,
              example: 'Doe'
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              pattern: '^\\+?[\\d\\s\\-\\(\\)]+$',
              example: '+1234567890'
            },
            image: {
              $ref: '#/components/schemas/ImageObject',
              description: 'Profile image',
              example: { src: 'https://example.com/profile.jpg' }
            },
            banner_image: {
              $ref: '#/components/schemas/ImageObject',
              description: 'Banner image',
              example: { src: 'https://example.com/banner.jpg' }
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name that caused the error'
                  },
                  message: {
                    type: 'string',
                    description: 'Error message for the field'
                  }
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK'
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Current timestamp'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './server.js'] // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
