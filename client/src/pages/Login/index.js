import React, { useContext, useState } from 'react'
import "./index.css"
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';
import MobileNavbar from '../../components/MobileNavbar';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function signIn(){
    axios.post("/login", {username, password}).then( (response) =>{
      console.log(response);
      sessionStorage.setItem("user", JSON.stringify(response.data));
      // setLoggedInUser(response.data);
      navigate("/");
  }).catch( (err) =>{
    console.log(err);
    if(err.response.status == 401){
      alert("Invalid login credentials");
    }
  })
  }

  function register(){
    axios.post("/users", {username, password}).then( (response) =>{
        navigate("/users/"+username);

    }).catch( (err) =>{
      if(err.response.status == 400){
        alert("This user already exists");
      }
    })
  }

  return (
    <>
        <MobileNavbar></MobileNavbar>
        <div className='login-panel'>
            <h1>Welcome</h1>
            <input type="text" id = "username" name="username" placeholder="Username" required value={username} onChange={(e) => {setUsername(e.target.value)}}></input> 
            <input type="password" id= "password" name="password" placeholder="Password"required value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
            <input type="button" id="sign-in" value = "Sign In" onClick={signIn}></input>
            <p>Not a member?</p>

            <input type="button" id="register" value = "Register" onClick={register}></input>

        </div>
    </>
  )
}

export default Login