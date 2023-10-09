const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    movie: {
        type:Schema.Types.ObjectId,
        ref: 'Movie'
    },

    rating:{
        type: Number,
        required: true,
        min: [0, "The movie rating must be at least 1"],
        max: [10, "The movie rating must be at most 10"]
    },

    basic:{
        type: String,
        required: true
    },

    reviewText:{
        type: String,
        required: function(){
            return !this.basic;
            // return [!this.basic, "Basic reviews can't have review text"]
        }
    },

    summary: {
        type: String,
        required: function(){
            return !this.basic;
            // return [!this.basic, "Basic reviews can't have a summary"]
        }
    },


});


module.exports = mongoose.model("Review", reviewSchema);
