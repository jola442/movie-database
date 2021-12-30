const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personSchema = Schema({
	name: {
		type: String, 
		required: true,
		minlength: 3,
		maxlength: 50
	},
    actor: {
        type: Boolean, 
        default: false
    },
    writer: {
        type: Boolean, 
        default: false
    },
    director: {
        type: Boolean, 
        default: false
    },
	followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
	movies: [{type: Schema.Types.ObjectId, ref: 'Movie'}],
    collaborators: {
        type: Map,
        of: Number
    },
});

// personObj.director = false;
// personObj.actor = false;
// personObj.writer = false;
// personObj.works = [];
// personObj.collaborators = {};
// personObj.mostFrequentCollaborators = [];
// personObj.followers = [];

module.exports = mongoose.model("Person", personSchema);
