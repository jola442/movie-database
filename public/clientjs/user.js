//This function sends a PUT request to /users/username/accountType and alters 
//the view to display the user's current account type
function changeAccountType(){
    let username = document.getElementById("username").innerHTML;
    let oldAccountTypeSubDiv = document.getElementById("accountType");
    let newAccountTypeSubDiv = document.createElement("div");
    let contributorOptionsSubDiv = document.getElementById("contributor-options");

    if(!contributorOptionsSubDiv){
        contributorOptionsSubDiv = document.createElement("div");
        contributorOptionsSubDiv.id = "contributor-options";
        let link = document.createElement("a");
        link.setAttribute("href", "/contributor-options");
        contributorOptionsSubDiv.appendChild(link);
        oldAccountTypeSubDiv.parentNode.parentNode.parentNode.appendChild(contributorOptionsSubDiv);
    }
   

    newAccountTypeSubDiv.id = "accountType";
    let newAccountTypeText = "";
    if(oldAccountTypeSubDiv.innerText === "Contributor"){
        newAccountTypeText = "Normal";
        contributorOptionsSubDiv.firstChild.innerHTML = "";
    }

    else if(oldAccountTypeSubDiv.innerText === "Normal"){
        newAccountTypeText = "Contributor";
        contributorOptionsSubDiv.firstChild.innerHTML = "Contributor Options";

    }

    newAccountTypeSubDiv.innerText = newAccountTypeText;
    oldAccountTypeSubDiv.parentNode.replaceChild(newAccountTypeSubDiv,oldAccountTypeSubDiv);

    //Updating the value of contributor on the server
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        
    }
    };
    xhttp.open("PUT", "/users/"+username+"/accountType", true);
    xhttp.send();
}

//This function sends a PUT request to /people/personName/followers with a body 
//that indicates whether a person should be added or removed from a list of followers
function follow(){
    let xhttp = new XMLHttpRequest();
    let username = document.getElementById("username").innerHTML;
    let action = {follow:true};
    // console.log(loggedInUsername);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            alert("Followed successfully");
            window.location.href = "/users/"+username;
        }
    };
    
    xhttp.open("PUT", "/users/"+username+"/followers", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(action));
}

//This function sends a PUT request to /people/personName/followers with a body 
//that indicates whether a person should be added or removed from a list of followers
function unfollow(){
    let xhttp = new XMLHttpRequest();
    // let loggedInUsername = document.getElementById("loggedInUser").innerHTML;
    let username = document.getElementById("username").innerHTML;
    let action = {follow:false};
    // console.log(loggedInUsername);
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        alert("Unfollowed successfully");
        window.location.href = "/users/"+username;
    }
    };
    xhttp.open("PUT", "/users/"+username+"/followers", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(action));
}
