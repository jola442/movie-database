const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = Schema({
    directors: [{type:Schema.Types.ObjectId, ref: 'Person', required:true}],
    writers: [{type:Schema.Types.ObjectId, ref: 'Person', required: true}],
    actors: [{type:Schema.Types.ObjectId, ref: 'Person', required: true}],
    genres: [{type:String, required:true}],
    year: {type:Number, required:true},
    runtime: {type:Number, required:true},
    plot: {type:String, required:true},
    rated: {type:String, required: true}, 
    poster: {type:String, required: true}
});



module.exports = mongoose.model("Movie", movieSchema);
