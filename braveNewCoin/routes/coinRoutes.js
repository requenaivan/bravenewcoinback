const Coin = require("../models").Coin;

module.exports = function(app, route) {

    function getCoinsByUser(req, res){
       
        return Coin.findAll({ where: { userId: req.params.id} ,raw: true})
            .then(results => {
                if(results.length > 0) {
                    
                    res.status(200).send({ mensaje:"OK", coins: results });
                } else {
                    res.status(200).send({ mensaje: 'No se encontro monedas del usuario'});
                    return;
                }
            })
            .catch(err => {
                res.status(400).send({ mensaje: 'Ocurrio un error en la aplicacion contactese con el administrador.'});
            });     
    }
    /**
     * @swagger
     * /getCoins:
     *  get:
     *      summary: Obtiene las monedas del usuario
     *      tags: [Moneda]
     *      description: Servicio para obtener las monedas del usuario
     *      produces:
     *            - application/json
     *      responses:
     *            "200":
     *                  description: Lista de monedas.
     */
    app.get('/getCoins/:id', route, getCoinsByUser);

};