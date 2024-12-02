const slugify = require('slugify');
const db = require('../../database/db.config');
const Article = db.articles;
//create a new post
exports.create=(req, res)=> {
    //recuperation des données
    const {reference, prix, quantite} = req.body;
    if(!reference || !prix || !quantite){
        return res.status(400).send({
            message : 'content can not be empty '
        })
    }
const newArticle = new Article({
    reference: reference,
    prix: prix,
    quantite: quantite,
});
newArticle.save().then((data) => {
    res.status(200).send({
        message: 'Successfully created Article'
    });
}).catch(err => {
    console.log(err);
});

};

exports.findAll = (req, res) => {
    Article.find({

    }).then((data)=> {
        res.send(data);
    }).catch((err)=> {
        console.log(err);
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ message: "Content is required" });
    }

    Article.findById(id)
        .select("reference quantite prix") // Sélectionnez à la fois les champs "reference" et "quantite"
        .then((data) => {
            if (!data) {
                return res.status(404).send({ message: "Article not found" });
            }
            res.send(data); // Renvoyer l'objet complet avec la référence et la quantité
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Internal server error" });
        });
};

exports.update =(req, res) =>{
    const id = req.params.id;
    const {quantite} = req.body;
    if(!id || !quantite ) {
    res.status(400).send({ message: "content is required "});
    }
    Article.findByIdAndUpdate(id,
    {quantite: quantite},
    {useFindAndModify: false}).then((data) =>{
        if(!data){
            res.status(404).send({ message: `Can not update artile with
            
            id=${id}`});
            }
            res.status(200).send({ message: `Article was successfully updated`});
            }).catch((err) =>{
            console.log(err);
            });
            }