const express = require('express');
let router = express.Router();
const model =  require("./businessLogic.js");
const Movie = require("./MovieModel");


router.get("/", [queryParser,respondWithMovies]);
router.get("/:title", respondWithMovie);

router.use(express.json());

router.post("/:title/actors", addNewActor);
router.post("/:title/writers", addNewWriter);
router.post("/:title/directors", addNewDirector)
router.post("/", addNewMovie)
router.post("/:title/reviews", updateReviews);




function addNewMovie(req, res){
    try{
                // console.log(req.body);
        if(!req.session.username || !(req.session.user.contributor)){
            res.status(401).send();
        }

        else if(model.addMovie(req.session.username, req.body)){
            res.status(201).send();
        }

        else{
            res.status(400).send();
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

}


function addNewActor(req, res){
    // console.log(req.body);
    // console.log(req.body.title);
    // console.log(model.movies[req.body.title]);

    // if(!req.session.username || !model.users[req.session.username].contributor){
    //     res.status(401).send();
    // }

    // else if(model.addActor(model.users[req.session.username], model.people[req.body.name], req.body.title)){
    //     res.status(200).send();
    // }

    // else{
    //     res.status(400).send();
    // }
}

function addNewDirector(req, res){
    // console.log(req.body);
    // console.log(req.body.title);
    // console.log(model.movies[req.body.title]);

    // if(!req.session.username || !model.users[req.session.username].contributor){
    //     res.status(401).send();
    // }

    // else if(model.addDirector(model.users[req.session.username], model.people[req.body.name], req.body.title)){
    //     res.status(200).send();
    // }

    // else{
    //     res.status(400).send();
    // }
}

function addNewWriter(req, res){
    // console.log(req.body);
    // console.log(req.body.title);
    // console.log(model.movies[req.body.title]);

    // if(!req.session.username || !model.users[req.session.username].contributor){
    //     res.status(401).send();
    // }

    // else if(model.addWriter(model.users[req.session.username], model.people[req.body.name], req.body.title)){
    //     res.status(200).send();
    // }

    // else{
    //     res.status(400).send();
    // }
}


async function updateReviews(req, res){
    try{
        if(req.session.username){
            // req.body.reviewer = req.session.username;
            if(await model.addReview(req.session.username, req.body)){
                // res.redirect("/movies/"+req.body.movieTitle);
                res.status(200).send();
                // res.status(200).render("movie", {username:req.session.username, movie:model.movies[req.params.movieTitle], reviews:model.reviews});
            }
            else{
                res.status(400).send();
            }
        }
    
        else{
            res.status(401).send();
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

    // next();
}

async function respondWithMovie(req, res){
    try{
        const movie = await Movie.findOne({title:req.params.title}).lean()
        .populate({path:'actors', select:{"_id":0, "name":1}})
        .populate({path:'writers', select:{"_id":0, "name":1}})
        .populate({path:'director', select:{"_id":0, "name":1}});

        if(movie){
            movie.reviews = await model.getReviews(movie.title);
            movie.averageRating = await model.getAverageRating(movie.title);
            res.format({"text/html":
                function(){
                    res.status(200).render("pages/movie", {username:req.session.username, movie: movie});
                },
            "application/json":
                function(){
                    res.status(200).json(movie);
                }});
        }
    
        else{
            console.log("Cant find this movie");
            res.status(404).send();
        }
    }

    catch{
	    console.log(err)
    }

    finally{
        return;
    }

   
}

//This function parses the provided query string so that movies can be matched to it
function queryParser(req, res, next){
    const MAX_RATING = 10;
    const MIN_RATING = 0;
    if(!req.query.title){
        req.query.title = "*";
    }

    if(!req.query.genre){
        req.query.genre = "*";
    }

    if(!req.query.year){
        req.query.year = "*";
    }

    else{
        try{
            req.query.year = Number(req.query.year);
        }

        catch{
            req.query.year = "*";
        }
    }


    if(req.query.minrating){
        try{
            req.query.minrating = Number(req.query.minrating);
            if(req.query.minrating > MAX_RATING){
                req.query.minrating = 10;
            }

            else if(req.query.minrating < MIN_RATING){
                req.query.minrating = 0;
            }
        }

        catch{
            req.query.minrating = undefined;
        }

    }

    next();

}

//This function checks whether a movie matches the provided query parameters
function movieMatches(movie, query){
    let titleCheck = query.title === "*"||movie.title.toLowerCase().includes(query.title.toLowerCase());
    let genreCheck = query.genre  === "*"||movie.genres.join().toLowerCase().includes(query.genre.toLowerCase());
    let yearCheck = query.year === "*"||movie.year === query.year;
    let minratingCheck = query.minrating == undefined||movie.averageRating >= query.minrating;
    return titleCheck && genreCheck && yearCheck && minratingCheck;
}

function respondWithMovies(req, res){
    res.results = [];

    // res.results = await Movie.find({});
    // for(movieName in model.movies){
    //     let movie = model.movies[movieName]
    //     if(movieMatches(movie, req.query)){
    //         res.results.push(movieName);
    //     }
    // }

    if(res.results.length == 0){
        res.status(404).send();
    }

    else{
        res.format(
            {"text/html": function(req, res){
                res.status(200).render("pages/movies", {modelMovies:model.movies, username:req.session.username, movies:res.results})
                },
            "application/json": function(req, res){
                res.status(200).json(res.results);
            }
        })
    }
}



module.exports = router;