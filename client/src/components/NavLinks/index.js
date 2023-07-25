import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios";

export default function NavLinks( {isMobile, isVisible}) {

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  console.log("This is the logged in user", loggedInUser)
  const navigate = useNavigate();


  function signOut(){
    // axios.delete("/signOut").then( (response) =>{
      localStorage.removeItem("user");
      navigate.to("/");
    // })
  }


  const visibleNavLinkStyle = {
    transform:"translateY(0)",
    transition:"transform 0.5s ease-in-out"
  }

  const invisibleNavLinkStyle = {...visibleNavLinkStyle, ...{transform:"translateY(-100%)"}};

  function computeStyle(){
    if(isMobile){
      if(isVisible){
        return visibleNavLinkStyle;
      }

      else{
        return invisibleNavLinkStyle;
      }
    }

    else{
      return null;
    }
  }


  return (
    <ul className={isMobile?"mobile-navList":"desktop-navList"} style={computeStyle()}>
        <li>
            <NavLink className={ ({isActive})=>{return isActive?"active":""} } to = "/">Home</NavLink>
        </li>

        <li >
            <NavLink className={ ({isActive})=>{return isActive?"active":""} } to= "/movies">Movies</NavLink>
        </li>

        {loggedInUser?
        <>
          <li>
            <NavLink className={ ({isActive})=>{return isActive?"active":""} } to={"/users/"+loggedInUser.username}>Profile</NavLink>
          </li>
          <li>
            <NavLink className={ ({isActive})=>{return isActive?"active":""} } to= "/" onClick={signOut}>Sign Out</NavLink>
          </li>
        </>
          :
          <li>
            <NavLink className={ ({isActive})=>{return isActive?"active":""} } to= "/login">Login</NavLink>
          </li>
}


    </ul>
  )
}
