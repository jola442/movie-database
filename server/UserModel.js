var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

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

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.query.byUsername = function(username){
    return this.where({username: new RegExp(username, 'i')});
}

module.exports = mongoose.model("User", userSchema);
