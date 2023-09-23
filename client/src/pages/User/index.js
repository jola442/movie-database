import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import "./index.css"
import {v4 as uuidv4} from "uuid";
import Switch from "react-switch";
import { FaStar } from 'react-icons/fa'

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import MobileNavbar from '../../components/MobileNavbar';


function User() {
  const {username} = useParams();
  let loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  const [user, setUser] = useState(null);
  const [contributor, setContributor] = useState(loggedInUser.contributor);
  let fakeUsers = ["Luffy", "Lelouch", "Dave", "Dave", "Dave", "Dave", "Dave"]

  useEffect( () => {
    axios.get("/users/" + username).then( res => {
        console.log(res.data);
        setUser(res.data);
        window.scrollTo(0,0);
    }).catch( (error) =>{
        console.error(error.response.data);
    })
},[username])

if(!user){
    return null;
}

function handleChange(){
    axios.put("/users/" + loggedInUser.username + "/accountType").then( (response) => {
        sessionStorage.setItem("user", JSON.stringify(response.data));
        loggedInUser = JSON.parse(sessionStorage.getItem("user"));
        setContributor(loggedInUser.contributor);
    })
}

function follow(){
    axios.put("/users/" + username + "/followers", {loggedInUser, follow:!loggedInUser.usersFollowing.includes(username)}).then( (res) =>{
        if(res.status === 200){
            alert("Followed");
            axios.get("/users/" + loggedInUser.username).then( (res) => {
                console.log("loggedInUser",res.data)
                if(res.status === 200){
                    sessionStorage.setItem("user", JSON.stringify(res.data));
                }
            }).catch( (err) => {
                console.log(err)
            })
        }
    })
}

  return (
    <>
    <MobileNavbar></MobileNavbar>
    <div className='user-wrapper'>
      <div className='user-left'>
        <div className='user-card'>
          <div className='user-img'>
            <img src="/blankpfp.png"></img>
          </div>

          <p className='username'><b>{user.username}</b></p>
          <label>
            <span><b>Contributor</b></span>

            {loggedInUser.username === user.username && <Switch checked={contributor} uncheckedIcon={false} checkedIcon={false} onChange={handleChange} onColor='#8685EF'/>}
        </label>
        
        </div>
        <div className='follow-btn'>
          <button name='follow' className='follow' onClick={follow}>{loggedInUser.usersFollowing.includes(username)?"Unfollow":"Follow"}</button>
        </div>  
      </div>




      <div className='user-right'>
   
            <p className='title'><b>Followers</b></p>
            <div className='followers-slider'>  
              <Swiper 
                  // install Swiper modules
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={20}
                  slidesPerView={5}
                  navigation
                  //   pagination={{ clickable: true }}
                  //   scrollbar={{ draggable: true }}
                  onSwiper={(swiper) => console.log(swiper)}
                  onSlideChange={() => console.log('slide change')}
                  >
                      {fakeUsers.map( (user) => (
                          <SwiperSlide key={uuidv4()}>
                              <Link to={"/users/"+ user}>
                                  <div className='follow-person' key={uuidv4()}>
                                      <div className='follow-person-image'>
                                        <img src="/blankpfp.png"/>
                                        <p>{user}</p>
                                      </div>
                                      
                                      
                                  </div>   
                              </Link>
                          </SwiperSlide> 
                      ))}
                    
                </Swiper>
            </div>  

            <p className='title'><b>Following</b></p>
            <div className='followers-slider'>
              <Swiper 
                  // install Swiper modules
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={20}
                  slidesPerView={5}
                  navigation
                  //   pagination={{ clickable: true }}
                  //   scrollbar={{ draggable: true }}
                  onSwiper={(swiper) => console.log(swiper)}
                  onSlideChange={() => console.log('slide change')}
                  >
                      {fakeUsers.map( (user) => (
                          <SwiperSlide key={uuidv4()}>
                              <Link to={"/users/"+ user}>
                                  <div className='follow-person' key={uuidv4()}>
                                      <div className='follow-person-image'>
                                        <img src="/blankpfp.png"/>
                                        <p>{user}</p>
                                      </div>
                                      
                                      
                                  </div>   
                              </Link>
                          </SwiperSlide> 
                      ))}
                    
                </Swiper>
            </div> 

      </div>
    </div>

    <div className='user-bottom-page'>
      <br></br>
            <p className='title'>Reviews</p>
            <div className='user-reviews'>
                <div className='user-review'>
                    <div className='user-review-left'>
                        <div className='user-reviewer-image'>
                            <img src="/blankpfp.png"></img>
                        </div>  
                        <p>Name</p>

                    </div>
                    <div className='user-review-right'>
                        <p className='user-review-summary'><b>Review Summary</b></p>
                        <div className='user-review-rating'>
                            <span>9.5</span>
                            <FaStar></FaStar>
                        </div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse luctus, ipsum nec efficitur cursus, elit diam mattis ipsum, eget sagittis diam enim eget justo. Integer urna justo, scelerisque sed porttitor id, facilisis ut neque. Pellentesque dignissim efficitur suscipit. Sed quis libero eu lectus mollis lacinia non eget tellus. Nullam vitae mollis orci, sit amet maximus lacus. Pellentesque eu elit ut nulla posuere gravida. Suspendisse potenti. Sed suscipit nulla lectus, a laoreet dolor venenatis nec. Sed pulvinar orci et orci gravida sollicitudin. Proin pulvinar ante vel felis auctor feugiat. Maecenas tempus maximus malesuada. Nam sit amet tortor at diam tincidunt consectetur.
                    </div>
            
                </div>
            </div>

      <br></br>
      <p className='title'>Recommmended Movies</p>
      <div className='user-movies-slider'>
                <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={20}
                slidesPerView={5}
                navigation
                //   pagination={{ clickable: true }}
                //   scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                >
                    {user.recommmendedMovies.map( (movie) => (
                        <SwiperSlide key={uuidv4()}>
                            <Link to={"/movies/"+ movie.title}>
                                <div className='movie' key={uuidv4()}>
                                    <img src={movie.poster} onError={(event) => {event.target.src="/blankmovie.jpg"}}/>
                                    <p>{movie.title}</p>
                                </div>   
                            </Link>
                        </SwiperSlide> 
                    ))}
                   
                </Swiper>
            </div>
    </div>


    </>

  )
}

export default User