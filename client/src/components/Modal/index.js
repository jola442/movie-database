import { memo, useState } from 'react'
import ReactDom  from 'react-dom';
import "./index.css"
import {v4 as uuidv4} from "uuid";
import { FaTimes } from "react-icons/fa"
import DOMPurify from 'dompurify';
import axios from 'axios';
import {useLocation, useNavigate } from 'react-router-dom';



const Modal = ( {title, isOpen, toggleModal, role, updateParentPage}) => {

    const [name, setName] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    function handleCloseClicked(){
        toggleModal();
        setName("")
    }

    function addPerson(){
        axios.post("/movies/"+title+"/"+role.toLowerCase()+"s", {name, movie:title}).then( (res) =>{
            toggleModal();
            if(res.status === 200){
                updateParentPage()
            }
            }                
        ).catch((err) => {
            alert("Could not add the new " + role)
        });
    
    }

  return ReactDom.createPortal(
    <>
        {isOpen &&
        <>
        <div className='modal-overlay' onClick={handleCloseClicked}>
        <div className='modal-container' onClick={(e) => {e.stopPropagation()}}>
            <div className='close-button' onClick={handleCloseClicked}> <FaTimes/></div>

            <p><b>{"Enter the new " + role.toLowerCase() + "'s name"}</b></p>
            <input type='textbox' value={name} name={name} onChange={(e) => {setName(e.target.value)}}></input>
            <button onClick={addPerson}>{"Add " + role}</button>
        </div>
            
        </div>
        
         </>} 
      
    </>, 
    document.getElementById("modal"))
}

export default memo(Modal)