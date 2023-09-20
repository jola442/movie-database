import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import "./index.css"
import {v4 as uuidv4} from "uuid";

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Person() {
  const {name} = useParams();
  const [person, setPerson] = useState(null)
  let fakeUsers = ["Luffy", "Lelouch", "Dave", "Dave", "Dave", "Dave", "Dave"]

  useEffect( () => {
    axios.get("/people/" + name).then( res => {
        console.log("got here")
        console.log(res.data);
        setPerson(res.data);
        window.scrollTo(0,0);
    }).catch( (error) =>{
        console.error(error.response.data);
    })
},[name])

if(!person){
    return null;
}

  return (
    <>
    <div className='person-wrapper'>
      <div className='left'>
        <div className='person-card'>
          <div className='person-img'>
            <img src="/blankpfp.png"></img>
          </div>

          <p className='name'><b>{person.name}</b></p>
        
          <div className='followers'>
            <p className='follower-count'><b>Followers: </b> {person.followers.length}</p>
          </div>  
        </div>
        <div className='follow-btn'>
          <button name='follow' className='follow'>Follow</button>
        </div>  
      </div>


      


      <div className='person-info-wrapper'>
          <p className='appeared-in'>Appeared In ({person.movies.length})</p>

          <div className='movies-slider'>
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
                    {person.movies.map( (movie) => (
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
    </div>

    
  <div className='collaborators-slider'>
    <p className='title'>Most Frequent Collaborators</p>
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
          {fakeUsers.map( (collaborator) => (
              <SwiperSlide key={uuidv4()}>
                  <Link to={"/users/"+ collaborator}>
                      <div className='collaborator' key={uuidv4()}>
                          <div className='collaborator-image'>
                            <img src="/blankpfp.png"/>
                            <p>{collaborator}</p>
                          </div>
                          
                          
                      </div>   
                  </Link>
              </SwiperSlide> 
          ))}
      
  </Swiper>
  </div> 
    </>

  )
}

export default Person