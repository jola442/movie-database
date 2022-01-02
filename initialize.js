const mongoose = require("mongoose");
const model = require("./businessLogic");
const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");
const Notificaiton = require("./NotificationModel");
MAX_MOVIES = 2;

let movies = require("./movie-data-short.json");


intialUsers = [{username: "Jola", password: "tears"},
	{username: "Dave", password: "joy"},
	{username: "Lelouch", password: "codegeass"},
	{username: "Light", password: "deathnote"},
	{username: "Luffy", password: "onepiece"},
]


model.db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped database. Starting re-creation.");

		User.insertMany(intialUsers, function(err, result){
			if(err){
				console.log(err)
				return;
			}
			model.changeAccountType("Jola")
			// .then(model.addMovie("Jola", {title:"Movie 1", director:"Director 1", actors:["Actor 1", "Actor 1", "Actor 2"], writers:["Writer 1", "Writer 3"], genres:["Action","Action", "Adventure"], year:"2001", runtime:"80 min", plot:"Boring", rated:"G"}))
			// .then(model.addMovie("Jola", {title:"Movie 2", director:"Director 2", actors:["Actor 2", "Actor 2", "Actor 3"], writers:["Writer 3","Writer 2"], genres:["Action","Drama", "Adventure"], year: "2001", runtime:"80 min", plot:"Boring", rated:"G"}))
			// .then(model.addMovie("Jola", {title:"Movie 3", director:"Director 2", actors:["Actor 1", "Actor 2", "Actor 3"], writers:["Writer 1","Writer 3","Writer 2"], genres:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"})).
			.then(model.addMovie("Jola", {title:"Movie 4", director:"Director 2", actors:["Actor 1", "Actor 3"], writers:["Writer 1","Writer 3"], genres:["Fantasy","Drama", "Adventure"], year:"2002", runtime:"80 min", plot:"Boring", rated:"R"})).catch((err)=>{console.log(err);})
		}

		)
	})
})

