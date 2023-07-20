import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import "./index.css"

function PaginatedLinks( {url, pageCount}) {
    const navigate = useNavigate();
    function generatePageURL(pageNum){
        let currentURL = url;
        let indexOfPage = currentURL.indexOf("page=");
        let pageURL = ""
        console.log("index of page", indexOfPage)
        if(indexOfPage == -1){
            pageURL = currentURL + "&page=" + pageNum;
        }
        
        else{
            currentURL = currentURL.slice(0, indexOfPage);
            pageURL = currentURL + "page=" + pageNum;
        }
        
        return pageURL;
        }

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    let pageURL = generatePageURL(event.selected+1)
    navigate(pageURL);
    window.scrollTo(0,0);
  };

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< Previous"
        renderOnZeroPageCount={null}
        containerClassName='pagination-container'
        pageClassName='page'
      />
    </>
  );
}


export default PaginatedLinks