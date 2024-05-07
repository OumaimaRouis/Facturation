module.exports = mongoose => {
    const Schema = mongoose.Schema;
    let ClientSchema = new Schema({
        name: {type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },  
        phone: { type: String },
    },{
       timestamps: true 
    });
    ClientSchema.method('toJSON', function(){
        const{__v,_id, ...object}= this.toObject();
        object.id = _id;
        return object;
    })
    const Post = mongoose.model('Client', ClientSchema);
    return Post;
}