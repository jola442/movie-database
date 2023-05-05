import React from 'react'
import { FaSearch } from 'react-icons/fa'

function SearchBar() {


    function search(){

    }
  return (
    <div className='search-bar'>
        <select id="search-options" name="search-options">
            <option value="title">Movie Title</option>
            <option value='genre'>Movie Genre</option> 
            <option value="minrating">Min Rating</option>
            <option value='year'>Movie Year</option> 
            <option value="users">Users</option>
            <option value='people'>People</option> 
        </select>

        <div className='search-textbox-div'>
            <input id="search-textbox" type="text" name="search-textbox" placeholder='Search...'></input>
        </div>

        <div className='search-button'>
            <button onClick={search}>
                <FaSearch />
            </button>
        </div>
    </div>

// div.searchtextbox
// input#searchbar(type='text' name='searchbar' placeholder='Search...')
// div.buttonDiv
// button(type='button' onclick = "search()")
//     i.fa.fa-search
//     div.searchselect
//     select#search-options(name='search-options')
        // option(value='title') Movie Title
        // option(value='genre') Movie Genre
        // option(value='minrating') Min Rating
        // option(value='year') Movie Year
        // option(value='users') Users
        // option(value='people') People
// div.searchtextbox
//     input#searchbar(type='text' name='searchbar' placeholder='Search...')
// div.buttonDiv
//     button(type='button' onclick = "search()")
//         i.fa.fa-search
  )
}

export default SearchBar