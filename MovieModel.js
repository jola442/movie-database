const mongoose = require("mongoose");
const { schema } = require("./ReviewModel");
const Schema = mongoose.Schema;
const Review = require("./ReviewModel");

let movieSchema = Schema({
    director: {
        type:Schema.Types.ObjectId,
        ref: 'Person', 
        required: true,
    },

    writers: {
        type:[{
            type:Schema.Types.ObjectId,
            ref: 'Person', 
            }],
        required:true,
        validate: [function(){return this.writers.length >= 1}]

    },

    actors: {
        type:[{
            type:Schema.Types.ObjectId,
            ref: 'Person', 
            }],
        required:true,
        validate: [function(){return this.actors.length >= 1}]

    },

    genres: {
        type:[String],
        required: true,
        validate: [function(){return this.genres.length >= 1}]
    },


    title: {
        type:String, 
        required: true,
        unique: true
    },
    year: {
        type:Number,
        required:true
    },
    runtime: {
        type:String,
        required:true
    },
    plot: {
        type:String,
        required:true
    },
    rated: {type:String,
            required: true,
    }, 
    poster: {
        type:String,
        // required: true
    },
});



movieSchema.query.byTitle = function(title){
    return this.where({title: new RegExp(title, 'i')});
}

movieSchema.query.byYear = function(year){
    return this.where({year});
}
movieSchema.query.byGenre = function(genre){
    genre = genre[0].toUpperCase() + genre.substring(1);
    return this.where({genres:genre});
}

module.exports = mongoose.model("Movie", movieSchema);
