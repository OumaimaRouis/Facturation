const slugify = require('slugify');
const db = require('../../database/db.config');
const Client = db.clients;
//create a new post
exports.create=(req, res)=> {
    //recuperation des données
    const {name, address, email, phone} = req.body;
    if(!name || !address){
        return res.status(400).send({
            message : 'content can not be empty '
        })
    }
const newClient = new Client({
    name: name,
    address: address,
    email: email,
    phone: phone
});
newClient.save(newClient).then((data)=>{

    res.status(200).send({
        message: 'successfully created Client'
    })
}).catch(err =>{
    console.log(err);
});
};

exports.findAll = (req, res) => {
    Client.find({

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
    Client.findByIdAndDelete(id).then((data)=>{
        if(!data){
            res.status(404).send({message:"Client not found"});
        }
        res.status(200).send({message: "Client was successfull deleted"});
    })
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    if(!id) {
        res.status(400).send({message: "content is required"});
    }
    Client.findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({ message: "Client not found" });
            }
            res.send(data); // Envoyer tous les champs du client
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Internal server error" });
        });
};

exports.findName = (req, res) => {
    const id = req.params.id;
    if(!id) {
        res.status(400).send({message: "ID is required"});
    }
    Client.findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({ message: "Client not found" });
            }
            // Récupérer le nom et l'adresse du client
            const { name, address } = data;
            // Envoyer le nom et l'adresse dans la réponse
            res.send({ name, address });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Internal server error" });
        });

}


exports.findByName = (req, res) => {
    const clientName = req.params.name; // Utiliser req.params au lieu de req.query
    if (!clientName) {
        return res.status(400).send({ message: "Client name is required" });
    }

    Client.findOne({ name: clientName })
        .then(client => {
            if (!client) {
                return res.status(404).send({ message: "Client not found" });
            }
            res.send({ id: client._id }); // Envoyer l'ID du client dans la réponse
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: "Internal server error" });
        });
};


exports.update =(req, res) =>{
    const id = req.params.id;
    const {name, address, email, phone} = req.body;
    if(!id || !name || !address || !email || !phone) {
    res.status(400).send({ message: "content is required "});
    }
    Client.findByIdAndUpdate(id,
    {name: name, address: address, email: email, phone: phone},
    {useFindAndModify: false}).then((data) =>{
        if(!data){
            res.status(404).send({ message: `Can not update Client with
            
            id=${id}`});
            }
            res.status(200).send({ message: `Client was successfully updated`});
            }).catch((err) =>{
            console.log(err);
            });
            }