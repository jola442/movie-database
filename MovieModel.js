const mongoose = require("mongoose");
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
        // validate: [function(){return this.genres.length >= 1}]
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
            // validate: function(){return this in}
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
    return this.where({year: new RegExp(year, 'i')});
}
movieSchema.query.byGenre = function(genre){
    return this.where({genre: new RegExp(genre, 'i')});
}

// movieSchema.virtual('averageRating').get(async function(){

// })


// movieSchema.virtual('similarMovies').get(async function(){

// })



// let validRatings = ["PG-13", "PG", "R", "G", "Not Rated", "Unrated", "N/A", "TV-14", "TV-Y", "TV", "13+","14A",
//  "16+", "18A", "18+", "R", "A", "TV-Y", "TV-G", "TV-Y7", "TV-Y7-FV", "TV-PG", "NC-17", "TV-MA"];

module.exports = mongoose.model("Movie", movieSchema);
