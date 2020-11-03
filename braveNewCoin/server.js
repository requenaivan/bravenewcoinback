const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = 'development';
const jwt = require("jsonwebtoken");
const config = require(__dirname + '/config/config.json')[env];
const app = express();
const route = express.Router(); 
const Sequelize = require('sequelize');

app.set('key', config.key);

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

let db;

if(process.env.NODE_ENV === 'test') {
  db = new Sequelize('sqlite::memory:', { force: true, logging: false});
} else {
  const db = require("./models");
  db.sequelize.sync();
  
  db.sequelize.sync({ force: false }).then(() => {
      console.log("Se sincronizo la bd.");
  });
}


route.use((req, res, next) => {
    const token = req.headers['access-token'];
    if (token) {
      jwt.verify(token, app.get('key'), (err, decoded) => {      
        if (err) {
          
          res.status(400).send({ respuesta: "KO_TOKEN_INVALIDO", mensaje: 'Token invalido' });
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.status(400).send({ respuesta: "KO_TOKEN_INVALIDO", mensaje: 'Token invalido' });
    }
 });

require(__dirname + "/routes/userRoutes")(app, route);
require(__dirname + "/routes/CoinRoutes")(app, route);
//require("./routes/userRoutes")(app, route);
//require("./routes/CoinRoutes")(app, route);

app.use("/api-docs", require("./routes/api-docs"));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la api bravenewcoin." });
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  
});

module.exports = server;