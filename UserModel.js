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
		required: [true, "You need a price…"],
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


module.exports = mongoose.model("User", userSchema);
// userObj.contributor = false;
//     userObj.followers = [];
//     userObj.usersFollowing = [];
//     userObj.peopleFollowing = [];
//     userObj.reviews = [];
//     userObj.recommendedMovies = [];
//     userObj.notifications = [];