const express = require('express');
var router = express.Router();
var path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

mongoose
.connect(
    "mongodb+srv://diegomd44:gaurplain@cluster0.r4icu.mongodb.net/MusicaDB?retryWrites=true&w=majority"
).catch((error) => handleError(error));


const musicaSchema = new mongoose.Schema(
    {
       // _id: mongoose.Schema.Types.ObjectId,
        album: String,
        artista: String,
        cancion: String,
        pais: String,        
        anio: Number
        
    },
    {
        collection: "Musica",
    }
);

const Musicax = mongoose.model("Musicax", musicaSchema);

//Muestra el html
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'pagcanciones.html'));
  });



//Metodo consulta todas las canciones
router.get("/all", (req, res)=>{
    Musicax.find((err,musica)=>{
        if(err) res.status(500).send("Error de la base de datos");
        else{
            res.status(200).json(musica);
        }
    });
});

//Eliminar por ID - funciona
router.delete("/:id", (req,res)=>{
    Musicax.findById(req.params.id, (err, musica)=>{
        if(err) res.status(500).send("Error en la base de datos");
        else{
            if(musica != null){
                musica.remove((error, result)=>{
                    if(error) res.status(500).send("Error en la base de datos");
                    else{
                        res.status(200).send("Eliminado correctamente");
                    }    
                });
            }else res.status(404).send("No se encontro esa cancion");
        }
    });
});


//Metodo modificar id - funciona
router.put("/:id", (req, res)=>{
    Musicax.findById(req.params.id, (err,musica)=>{
        if(err)
        res.status(500).send("Error en la base de datos");
        else{
            if(musica != null){
                musica.album = req.body.album;
                musica.artista = req.body.artista;
                musica.cancion = req.body.cancion;
                musica.pais = req.body.pais;
                musica.anio = req.body.anio;

                musica.save((error, musica1)=>{
                    if(error) res.status(500).send("Error de la base de datos");
                    else{
                        res.status(200).send("Modificado");
                    }
                });
            }else res.status(404).send("No se encontro esa cancion");
        }
    })
});

//Metodo consulta entre dos anios - funciona
router.get("/dosanios", (req,res)=>{
    Musicax.find({anio:{$gte: req.query.anio1, $lte: req.query.anio2}},(err,musica)=>{
        if(err){
            res.status(500).send("Error en la base de datos");
        }else res.status(200).json(musica);
    });
});


//Metodo consulta por anio - funciona
router.get("/panio", function(req,res){
    Musicax.find({anio:{$gte: req.query.anio}},(err,musica)=>{
        if(err){
            res.status(500).send("Erro en la base de datos");
        }else res.status(200).json(musica);
    });
});



//Metodo para consulta por nombre - funciona
router.get("/pnombre", (req, res) => {
Musicax.find({artista: req.query.artista},(err, musica)=>{
if(err) res.status(500).send("error en la base de datos");
else res.status(200).json(musica);  
    });
});

//Metodo buscar por id - funciona
router.get("/:id", (req, res) => {
    Musicax.findById(req.params.id, function(err, musica){
        if(err) res.status(500).send("error en la base de datos");
        else{
            if(musica != null){
                res.status(200).json(musica);
            }else res.status(404).send("No se encontro ese ID");
        }
    });
});


//Metodo para crear canciones - funciona
router.post("/", function (req, res) {

    const musica1 = new Musicax({
        album: req.body.album,
        artista: req.body.artista,
        cancion: req.body.cancion,
        pais: req.body.pais,        
        anio: req.body.anio,
    });
  
    musica1.save(function (error, musica1) {
      if (error) {
        res.status(500).send("No se ha podido agregar.");
      } else {
        res.status(200).json(musica1); 
      }
    });
  });




module.exports = router;