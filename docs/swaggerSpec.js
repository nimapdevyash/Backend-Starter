
const swaggerJSDoc = require("swagger-jsdoc");
const { version } = require("../package.json");

const swaggerDefinition = {
  
  info: {
      title: "Air Charter API Docs",
      version,
      description: "API documentation for the Air Charter backend",
    },
  host: process.env.BASE_URL_SWAGGER,
  basePath: "/api",
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      scheme: "jwt",
      in: "header",
    },
  },
};
const options = {
  swaggerDefinition,
  apis: [__dirname + "/swagger/*.js"]


};

exports.swaggerSpec = swaggerJSDoc(options);