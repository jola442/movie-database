const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	username: {
		type: String, 
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 50
	},
	password: {
		type: String,
		required: true
	},
	contributor: {
		type: Boolean,
		default: false, 
	},
	followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
	reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
	usersFollowing: [{type: Schema.Types.ObjectId, ref: 'User'}],
	peopleFollowing:  [{type: Schema.Types.ObjectId, ref: 'Person'}],
	recommmendedMovies: [{type:Schema.Types.ObjectId, ref: 'Movie'}],
});

userSchema.query.byUsername = function(username){
    return this.where({username: new RegExp(username, 'i')});
}

module.exports = mongoose.model("User", userSchema);
