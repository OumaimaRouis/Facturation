const { articles } = require('../../database/db.config');

module.exports = mongoose => {
    const Schema = mongoose.Schema;

    // Assuming you have Client and Article schemas defined elsewhere
    const Post = require('./client.model');
    const Article = require('./article.model');

    const ArticleDetailsSchema = new Schema({
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    quantite: { type: Number, required: true },
});
    // Define FactSchema
    let FacturationSchema = new Schema({
        numeroFacture: { type: Number, required: true },
        dateFacture: { type: Date, required: true },
        client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },  
        articles: [ArticleDetailsSchema], 
        amount: [{ type: Number }],
        totalAmount: {type: Number},
    },{
        timestamps: true 
    });

    // Define toJSON method for serialization
    FacturationSchema.method('toJSON', function(){
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    // Create and export Fact model
    const Facturation = mongoose.model('Facturation', FacturationSchema);

    // Function to retrieve Facturations with client name and article reference populated
    const getFacturationsWithPopulate = async () => {
        try {
            const facturations = await Fact.find({})
                .populate('client', 'name') // Populate the 'client' field with the 'name' field from the Client collection
                .populate('article', 'reference', 'prix', 'quantite'); // Populate the 'article' field with the 'reference' field from the Article collection
                console.log(facturations)
            return facturations;

        } catch (error) {
            console.error('Error while retrieving facturations:', error);
            throw error;
        }
    };

    return { Facturation };
}
