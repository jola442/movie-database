import React, { useEffect, useState } from 'react'
import "./index.css"
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PaginatedLinks from '../../components/PaginatedLinks';
import MobileNavbar from '../../components/MobileNavbar';


function Users() {
    const [users, setUsers] = useState([]);
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [pageCount, setPageCount] = useState(1);
    const navigate = useNavigate();


  useEffect( () => {
    console.log("Pathname" + location.pathname + location.search);
      axios.get(location.pathname + location.search).then( res => {
          console.log(res.data);
          console.log("Last elem",res.data.slice(-1));
          setPageCount(res.data.splice(-1)[0].pageCount);
          setUsers(res.data);
      })


  },[location])

  if(!users){
    return null;
}


  return (
    <>
        <MobileNavbar/>
        <div className='people-container'>
        <div className='results-label'>Showing results for "{searchParams.get("username")}"</div>
        <div className='people-div'>
            {users.map( (user) =>(
                <div className='person-div'>

                    <div className="person-img">
                        <img src="/blankpfp.png"></img>
                    </div>

                    <div className='person-desc'>
                        <p className='person-name'>{<Link to={"/users/"+user}>{user}</Link>}</p>
                    </div>

                </div>

            ))}
        </div>

        {location.search.includes("?") && pageCount > 1 && <PaginatedLinks url={location.pathname+location.search} pageCount={pageCount}/>}
    </div>
    </>
    

    
    
  )
}

export default Users