const request = require('supertest');
const app = require('../server');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const User = require("../models").User;
const Coin = require("../models").Coin;

describe('Post EndPoints', ()=> {

    beforeAll(async () => {
        User.destroy({ where: {}});
    });

    afterAll(async done => {
        await User.sequelize.close();
        app.close();
        done();
    });

    it('Debe crear un nuevo usuario ', (done) => {
        request(app).post('/user').send({
            name: 'ivan',
            lastname: 'requena',
            username: 'ivan',
            password: '12345678',
          }).then(res => {
            expect(res.statusCode).toEqual(200);
            done();
          });
    
    });

      it('Validaciones al crear un nuevo usuario ', async done  => {
        const res = await request(app).post('/user').send({
            name: null,
            lastname: 'requena',
            username: 'ivan',
            password: '12345678',
          });
    
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(expect.stringContaining("mensaje\":\"KO\""));
        done();
    });

    it('Debe realizar el login', async done => {
        const res = await request(app).post('/login').send({
            username: "ivan",
            password: "12345678"
        });

        expect(res.statusCode).toEqual(200);
        
        expect(res.text).toEqual(expect.stringContaining("Autenticación correcta"));
        done();
    });

    it('No Debe realizar el login', async done => {
        const res = await request(app).post('/login').send({
            username: "N/A",
            password: "N/A"
        });

        expect(res.statusCode).toEqual(400);
        
        expect(res.text).toEqual(expect.stringContaining("{\"mensaje\":\"Usuario no encontrado\"}"));
        done();
    });
});