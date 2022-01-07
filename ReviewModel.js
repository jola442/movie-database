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
        required: true
    },

    basic:{
        type: String,
        required: true
    },

    reviewText:{
        type: String,
        required: function(){
            return !this.basic
        }
    },

    summary: {
        type: String,
        required: function(){
            return !this.basic
        }
    },


});

// personObj.director = false;
// personObj.actor = false;
// personObj.writer = false;
// personObj.works = [];
// personObj.collaborators = {};
// personObj.mostFrequentCollaborators = [];
// personObj.followers = [];

module.exports = mongoose.model("Review", reviewSchema);
