const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Quotes API',
    description: 'API for managing quotes'
  },
  host: 'localhost:9090',
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js', './routes/*.js'];

swaggerAutogen(outputFile, endpointsFiles, doc); 