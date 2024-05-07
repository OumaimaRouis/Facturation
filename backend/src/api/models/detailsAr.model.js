module.exports = mongoose => {
    const Schema = mongoose.Schema;

    let DetailArSchema = new Schema({
        // Champs pour les détails de l'article
        articles: [{
            articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
            description: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            amount: { type: Number, required: true }
        }]

    }, { timestamps: true });


    DetailArSchema.method('toJSON', function() {
        const { _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Detail = mongoose.model('Detail', DetailArSchema);
    return Detail;
};
