import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portal 50+ API',
      version: '1.0.0',
      description: 'Documentación de la API de Portal 50+ con Express y TypeScript',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // rutas donde están las anotaciones JSDoc
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
