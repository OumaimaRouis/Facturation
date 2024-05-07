module.exports = mongoose => {
    const Schema = mongoose.Schema;
    let ArticleSchema = new Schema({
        reference: { type: String, required: true },
        prix: { type: Number, required: true },
        quantite: { type: Number, required: true },
    }, {
        timestamps: true
    });

    // Définir la méthode toJSON pour le schéma
    ArticleSchema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Article = mongoose.model('Article', ArticleSchema);

    // Ajouter la méthode findByIdAndUpdate au modèle
    ArticleSchema.statics.findByIdAndUpdate = function(id, update, options) {
        return this.findOneAndUpdate({ _id: id }, update, options);
    };
    

    return Article;
}
