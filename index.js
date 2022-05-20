const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var canciones = require('./Canciones');
var path = require('path');

app.listen(3000, ()=> console.log("escuchando en el puerto 3000"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/canciones', canciones);

app.get('/', function (req, res) {
    res.status(200).send("Hola, bienvenido")
});


app.use(function(req, res) {
    res.status(404).send('Esa pagina no existe!');
  });