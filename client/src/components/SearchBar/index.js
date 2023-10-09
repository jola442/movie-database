import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import "./index.css"

function SearchBar() {
    const location = useLocation();
    const [searchOption, setSearchOption] = useState("title")
    const [searchText, setSearchText] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        setSearchOption("title");
        if(!(location.pathname + location.search).includes("?")){
            setSearchText("")
        };
        
    }, [location])
    

    function handleSearchOptionChanged(event){
        setSearchOption(event.target.value);
    }

    function handleSearchTextChanged(event){
        setSearchText(event.target.value);
    }

    function handleKeyDown(event){
        if(event.key == "Enter"){
            return search()
        }
    }


    function search(){
        console.log(searchText, searchOption)
    
        let body = "";
        let option = searchOption;

        if(searchOption === "title"|| searchOption === "genre" || searchOption === "minrating" || searchOption === "year"){
            body = "/movies?";
        }
    
        else if(searchOption === "people"){
            body = "/people?";
            option = "name";
        }
    
        else if(searchOption === "users"){
            body = "/users?";
            option = "username";
        }
    
        let url = body + option + "=" + searchText;
        console.log(url);
        // setSearchText("");
        axios.get(url).then( res => {
            navigate(url);
            console.log(res.data);
           
        })
    }

    function mobileSearch(){

    }

    
  return (
    <>
        <div className='mobile-search-bar'>
            <button onClick={mobileSearch}>
                <FaSearch className='mobile-search-icon'/>
                <div className='mobile-search-textbox-div'>
                    <input id="search-textbox" value={searchText} onKeyDown={handleKeyDown} onChange={handleSearchTextChanged} type="text" name="search-textbox" placeholder='Search...'></input>
                </div>
            </button>
        </div>
        <div className='search-bar'>
            <select value={searchOption} id="search-options" name="search-options" onChange={handleSearchOptionChanged}>
                <option value="title">Movie Title</option>
                <option value='genre'>Movie Genre</option> 
                <option value="minrating">Min Rating</option>
                <option value='year'>Movie Year</option> 
                <option value="users">Users</option>
                <option value='people'>People</option> 
            </select>

            <div className='search-textbox-div'>
                <input id="search-textbox" value={searchText} onKeyDown={handleKeyDown} onChange={handleSearchTextChanged} type="text" name="search-textbox" placeholder='Search...'></input>
            </div>

            <div className='search-button'>
                <button onClick={search}>
                    <FaSearch />
                </button>
            </div>  
        </div>
    </>
  )
}

export default SearchBar