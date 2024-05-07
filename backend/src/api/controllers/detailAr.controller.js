const slugify = require('slugify');
const db = require('../../database/db.config');
const Detail = db.detailAr;

// Créer un nouveau détail d'article
exports.create = (req, res) => {
    // Récupérer les données de la requête
    const { articles } = req.body;

    // Vérifier si des données requises sont manquantes
    if (!articles || articles.length === 0) {
        return res.status(400).send({
            message: 'Les champs ne peuvent pas être vides'
        });
    }

    // Créer une nouvelle instance de détail d'article avec les données reçues
    const newDetail = new Detail({ articles });

    // Sauvegarder la nouvelle instance dans la base de données
    newDetail.save()
        .then(data => {
            res.status(200).send({
                message: 'Détail de l\'article créé avec succès'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                message: 'Une erreur est survenue lors de la création du détail de l\'article'
            });
        });
};

// Trouver tous les détails des articles
exports.findAll = (req, res) => {
    Detail.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                message: 'Une erreur est survenue lors de la récupération des détails des articles'
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ message: "L'identifiant est requis" });
    }
    Detail.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: "Détail de l'article non trouvé" });
            }
            res.status(200).send(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: "Une erreur est survenue lors de la recherche du détail de l'article" });
        });
};

// Supprimer un détail d'article
exports.delete = (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).send({ message: "L'identifiant est requis" });
    }
    Detail.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Détail de l'article introuvable" });
            }
            res.status(200).send({ message: "Détail de l'article supprimé avec succès" });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: "Une erreur est survenue lors de la suppression du détail de l'article" });
        });
};
