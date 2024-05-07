const slugify = require('slugify');
const db = require('../../database/db.config');
const Facturation = db.facturations.Facturation;

//create a new post
exports.create = (req, res) => {
    // Récupération des données
    const { numeroFacture, dateFacture, client, articles } = req.body;
    console.log("Données reçues depuis le frontend : ", req.body);

    // Vérification si des données requises sont manquantes
    if (!numeroFacture || !dateFacture || !client || !articles) {
        return res.status(400).send({
            message: 'Les champs ne peuvent pas être vides'
        });
    }

    // Création d'un tableau pour stocker les articles au format attendu par le modèle
    const articleIds = articles.map(articles => articles.id);

    // Création d'une nouvelle instance de Facturation avec les données reçues
    const newFacturation = new Facturation({
        numeroFacture: numeroFacture,
        dateFacture: dateFacture,
        client: client,
        articles: articles
    });
    console.log("Données de la facturation avant sauvegarde :", newFacturation);


    // Sauvegarde de la nouvelle instance dans la base de données
    newFacturation.save()
        .then(data => {
            res.status(200).send({
                message: 'Facturation créée avec succès'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                message: 'Une erreur est survenue lors de la création de la facturation'
            });
        });
};


exports.findAll = (req, res) => {
    Facturation.find({

    }).then((data)=> {
        res.send(data);
    }).catch((err)=> {
        console.log(err);
    });
};

exports.delete = (req, res)=> {
    const id = req.params.id;
    if(!id) {
        res.status(400).send({message:"content is required"});
    }
    Facturation.findByIdAndDelete(id).then((data)=>{
        if(!data){
            res.status(404).send({message:"Facturation not found"});
        }
        res.status(200).send({message: "Facturation was successfull deleted"});
    })
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    if(!id) {
        res.status(400).send({message: "content is required"});
    }
    Facturation.findById(id).then((data) => {
        res.send(data);
    }).catch((err)=> {
        console.log(err);
    })
};

exports.update =(req, res) =>{
    const id = req.params.id;
    const {numeroFacture, dateFacture, client, article} = req.body;
    if(!id || !numeroFacture || !dateFacture || !client || !article) {
    res.status(400).send({ message: "content is required "});
    }
    Facturation.findByIdAndUpdate(id,
    {numeroFacture: numeroFacture, dateFacture: dateFacture, client: client, article: article},
    {useFindAndModify: false}).then((data) =>{
        if(!data){
            res.status(404).send({ message: `Can not update Facturation with
            
            id=${id}`});
            }
            res.status(200).send({ message: `Facturation was successfully updated`});
            }).catch((err) =>{
            console.log(err);
            });
            }