const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quotes API',
      version: '1.0.0',
      description: 'A simple API to manage quotes',
    },
    servers: [
      {
        url: 'http://localhost:9090',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);
module.exports = specs; 