"use strict";
const express = require("express");
const app = express();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "v1.0",
            title: "Documentacion prueba Sophos",
            description: "Documentacion para la api",
            contact: {
                name: "Ivan Requena",
                email: "ivanjavier1121@gmail.com"
            },
            servers:["http://localhost:9000"]
        }
    },
    basePath: "/",
    apis: ["./routes/userRoutes.js", "./routes/coinRoutes.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports= app;