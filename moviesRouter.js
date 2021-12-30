const express = require('express');
let router = express.Router();
const model =  require("./businessLogic.js");


router.get("/", [queryParser,respondWithMovies]);
router.get("/:movieTitle", respondWithMovie);

router.use(express.json());

router.post("/:movieTitle/actors", addNewActor);
router.post("/:movieTitle/writers", addNewWriter);
router.post("/:movieTitle/directors", addNewDirector)
router.post("/", addNewMovie)
router.post("/:movieTitle/reviews", updateReviews);




function addNewMovie(req, res){
    // console.log(req.body);
    if(!req.session.username || !model.users[req.session.username].contributor){
        res.status(401).send();
    }

    else if(model.addMovie(req.session.username, req.body)){
        res.status(201).send();
    }

    else{
        res.status(400).send();
    }
}


function addNewActor(req, res){
    // console.log(req.body);
    // console.log(req.body.title);
    // console.log(model.movies[req.body.title]);

    if(!req.session.username || !model.users[req.session.username].contributor){
        res.status(401).send();
    }

    else if(model.addActor(model.users[req.session.username], model.people[req.body.name], req.body.title)){
        res.status(200).send();
    }

    else{
        res.status(400).send();
    }
}

function addNewDirector(req, res){
    // console.log(req.body);
    // console.log(req.body.title);
    // console.log(model.movies[req.body.title]);
    if(!req.session.username || !model.users[req.session.username].contributor){
        res.status(401).send();
    }

    else if(model.addDirector(model.users[req.session.username], model.people[req.body.name], req.body.title)){
        res.status(200).send();
    }

    else{
        res.status(400).send();
    }
}

function addNewWriter(req, res){
    // console.log(req.body);
    // console.log(req.body.title);
    // console.log(model.movies[req.body.title]);
    if(!req.session.username || !model.users[req.session.username].contributor){
        res.status(401).send();
    }

    else if(model.addWriter(model.users[req.session.username], model.people[req.body.name], req.body.title)){
        res.status(200).send();
    }

    else{
        res.status(400).send();
    }
}


function updateReviews(req, res){
    if(req.session.username){
        req.body.reviewer = req.session.username;
        if(model.writeReview(req.body)){
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
    // next();
}

function respondWithMovie(req, res){
    if(model.isValidMovie(model.movies[req.params.movieTitle])){
        res.format({"text/html":renderMoviePage,
        "application/json":sendMovie});
    }

    else{
        res.status(404).send();
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
    for(movieName in model.movies){
        let movie = model.movies[movieName]
        if(movieMatches(movie, req.query)){
            res.results.push(movieName);
        }
    }

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

function renderMoviePage(req, res, next){
    res.status(200).render("pages/movie", {users:model.users, username:req.session.username, movie:model.movies[req.params.movieTitle], reviews:model.reviews});
}

function sendMovie(req, res){
    res.json(model.movies[req.params.movieTitle]);
}
module.exports = router;