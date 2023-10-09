
const http = require('http');
const fs = require("fs");
const pug = require("pug");

const userTemplate = pug.compileFile("./user.pug");

user1 = {username:"Jola", password: "tears", followers:["Dave", "Ajayi"], usersFollowing:["Dave"], peopleFollowing:["Luffy", "Light", "Lelouch"], reviews:[0,2], recommendedMovies:["Toy Story"]};




const server = http.createServer(function (request, response) {
	if(request.method === "GET"){
		if(request.url === "/" || request.url === "/index.html"){
		
			fs.readFile("./index.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.write("Server error.");
					response.end();
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.write(data);
				response.end();
            });
        }

        else if(request.url === "/index.css"){
        
            fs.readFile("./index.css", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/css");
                response.write(data);
                response.end();
            });
        }

        else if(request.url === "/Images/moviebg.png"){
          
            fs.readFile("./Images/moviebg.png", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "image/gif");
                response.write(data);
                response.end();
            });
        }

        else if(request.url === "/Images/movie1.jpg"){
         
            fs.readFile("./Images/movie1.jpg", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "image/gif");
                response.write(data);
                response.end();
            });
        }

        else if(request.url === "/Images/blankpfp.png"){
          
            fs.readFile("./Images/blankpfp.png", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "image/gif");
                response.write(data);
                response.end();
            });
        }
            
        else if(request.url === "/movies.html"){
                
            fs.readFile("./movies.html", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/html");
                response.write(data);
                response.end();
            });
        }
        else if(request.url === "/movies.css"){
       
            fs.readFile("./movies.css", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/css");
                response.write(data);
                response.end();
            });
        }
		else if(request.url === "/movies.js"){
	
			fs.readFile("./movies.js", function(err, data){
				if(err){
					response.statusCode = 500;
					response.write("Server error.");
					response.end();
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript");
				response.write(data);
				response.end();
            });
            
        }          
        else if(request.url === "/user1.html"){
            let content = userTemplate({user:user1});
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.end(content);
            // fs.readFile("user1.html", function(err, data){
            //     if(err){
            //         response.statusCode = 500;
            //         response.write("Server error.");
            //         response.end();
            //         return;
            //     }
            //     response.statusCode = 200;
            //     response.setHeader("Content-Type", "text/html");
            //     response.write(data);
            //     response.end();
            // });
        }
        else if(request.url === "/user1.css"){
          
            fs.readFile("./user1.css", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/css");
                response.write(data);
                response.end();
            });
        }
        else if(request.url === "/user1.js"){
            //read todo.js file and send it back
            fs.readFile("./user1.js", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "application/javascript");
                response.write(data);
                response.end();
            });
                
        }
        
        else if(request.url === "/login.html"){
            //read the todo.html file and send it back
            fs.readFile("./login.html", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/html");
                response.write(data);
                response.end();
            });
        }
        
        else if(request.url === "/login.css"){
            //read the todo.html file and send it back
            fs.readFile("./login.css", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/css");
                response.write(data);
                response.end();
            });
        }

        else if(request.url === "/login.js"){
            //read todo.js file and send it back
            fs.readFile("./login.js", function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.write("Server error.");
                    response.end();
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "application/javascript");
                response.write(data);
                response.end();
            });
                
        }

		else{
			response.statusCode = 404;
			response.write("Unknwn resource.");
			response.end();
        }
	}else if(request.method === "POST"){
        if(request.url === "/verifyaccount"){
			let body = "";
			request.on('data', (chunk)=>{
				body += chunk;
			})

			request.on("end", ()=>{
                body = JSON.parse(body);
                if(body.username === user1.username && body.password === user1.password){
                    response.write("Securely signed in");
                }
                
                else{
                    response.write("Invalid login info");
                }
				response.end();
			})

		}
    }
    else if(request.method === "PUT"){
        if(request.url === "/changeaccounttype"){
            user1.contributor = !user1.contributor;
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(JSON.stringify(user1));
            response.end();
        }
    }
});

//Server listens on port 3000
// server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
