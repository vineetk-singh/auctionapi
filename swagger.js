import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'Simple REST API with MongoDB and Express',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [
    {
      bearerAuth: [] // Applies globally
    }
  ],
  apis: ['./routes/*.js'], // Path to your route files
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };