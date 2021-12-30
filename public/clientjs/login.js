//Registering the enter key with the search function
document.getElementById("searchbar").addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        search();
    }
})

//This function sends a POST request to the server with information provided through user input
function verifyAccount(){
    let xhttp = new XMLHttpRequest();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        window.location.href = "./home"
    }
    else if(this.readyState == 4 && this.status == 401){
        alert("Invalid login credentials");
    }
    };
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.send(JSON.stringify({username: username, password: password}));
}

//This function makes a POST request to /users with information provided through user input
function register(){
    let xhttp = new XMLHttpRequest();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        window.location.href = "/users/"+username;
    }
    else if(this.readyState == 4 && this.status == 400){
        alert("This user already exists");
    }
    };
    xhttp.open("POST", "/users", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.send(JSON.stringify({username: username, password: password}));
}

//This function sends a GET request to the server with a URL that depends on user input
function search(){
    let option = document.getElementById("search-options").value;
    let value = document.getElementById("searchbar").value;

    let body = "";
    if(option === "title"|| option === "genre" || option === "minrating" || option === "year"){
        body = "/movies?";
    }

    else if(option === "people"){
        body = "/people?";
        option = "name";
    }

    else if(option === "users"){
        body = "/users?";
        option = "name";
    }

    let url = body + option + "=" + value;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        window.location.href = url;
    }

    else if(this.readyState == 4 && this.status == 404){
        alert("No search results");
    }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}