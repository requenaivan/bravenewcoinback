const User = require("../models").User;
const Coin = require("../models").Coin;
const jwt = require("jsonwebtoken");
const md5 = require("md5");

module.exports = function(app, route) {
    
    function login(req, res) {
        if (!req.body.username) {
            res.status(400).send({err : 'Debe especificar un usuario'});
            return;
        }

        if (!req.body.password) {
            res.status(400).send({err : 'Debe especificar un password'});
            return;
        }
        
        return User.findOne({ where: { username: req.body.username.toLowerCase()}, raw: true })
            .then(result => {
                if(result) {
                    const user = result;
                    if(user.password === md5(req.body.password)) {
                        user.password = null;
                        const payload = {
                            sub: user,
                            check:  true
                        };
                        var token = jwt.sign(payload, app.get('key'), {
                            expiresIn: 60 * 60 
                        });
                        user.token = token;
                        res.status(200).send({ mensaje: 'Autenticación correcta', user: user});
                    } else {
                        res.status(400).send({ mensaje: 'Contraseña incorrecta'});
                    }                    
                } else {
                    res.status(400).send({ mensaje: 'Usuario no encontrado'});
                }
            })
            .catch(err => {
                res.status(400).send({ mensaje: 'Ocurrio un error en la aplicacion contactese con el administrador.'});
            });        
    }

    function create(req, res) {
        return User.create ({
             name: req.body.name,
             lastname: req.body.lastname,
             username: req.body.username.toLowerCase(),
             password: md5(req.body.password)
        }).then(usuario => {
            res.status(200).send({mensaje: "Usuario Creado correctamente", respuesta: usuario})
        }).catch(error => {
            if(error.errors) {
                res.status(400).send({mensaje:"KO", respuesta: error.errors[0]})
            } else {
                res.status(400).send({mensaje:"KO", respuesta: error})
            }
        });
    };


    /**
     * @swagger
     * /login:
     *  post:
     *      summary: Login de un usuario
     *      description: Servicio para loguear a un usuario
     *      tags: [Usuario]
     *      produces:
     *            - application/json
      *      parameters:
     *            - in: body
     *              username: Username del usuario
     *              password: Contraseña del usuario
     *              schema:
     *                      type: object
     *                      properties:
     *                          username:
     *                              type: string
     *                          password:
     *                              type: string
     *      responses:
     *          '200':
     *              description: Autenticación correcta
     *          '400':
     *              description: Errores
     *              
     */
    app.post('/login', login);

    /**
     * @swagger
     * /user:
     *  post:
     *      summary: Crea un usuario
     *      description: Servicio para Crear un usuario
     *      tags: [Usuario]
     *      produces:
     *            - application/json
     *      parameters:
     *            - in: body
     *              name: Nombre del usuario
     *              lastname: Apellido del usuario
     *              username: Username del usuario a crear
     *              password: Contraseña del usuario
     *              schema:
     *                      type: object
     *                      properties:
     *                          name:
     *                              type: string
     *                          lastname:
     *                              type: string
     *                          username:
     *                              type: string
     *                          password:
     *                              type: string
     *      responses:
     *          '200':
     *              description: Usuario Creado correctamente 
     *          '400':
     *             description: Errores
     *              
     */
    app.post("/user", create);

};