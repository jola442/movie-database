import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import "./index.css"
import {v4 as uuidv4} from "uuid";
import { FaPencilAlt, FaPlus, FaStar } from 'react-icons/fa'
import Modal from '../../components/Modal';
import MobileNavbar from "../../components/MobileNavbar"
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


function Movie() {
    const {title} = useParams();
    const [movie, setMovie] = useState(null);
	const [modalSelection, setModalSelection] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [pageUpdated, setPageUpdated] = useState(false);
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

	function toggleModal(){
		setIsModalOpen(!isModalOpen);
	}

	function updatePage(){
		setPageUpdated(true);
	}


    useEffect( () => {
        axios.get("/movies/" + title).then( res => {
            console.log(res.data);
            setMovie(res.data);
            window.scrollTo(0,0);
        }).catch( (error) =>{
            console.error(error.response.data);
        })
    },[title, pageUpdated])

    if(!movie){
        return null;
    }

    

  return (
    <>
        <MobileNavbar></MobileNavbar>
        <div className='movie-container'>
            <div className='movie-wrapper'>
                <div className='movie-img'>
                    <img src={movie.poster} onError={(event) => {event.target.src="/blankmovie.jpg"}}></img>
                </div>
                <div className='movie-info-wrapper'>
                    <div className='movie-info-top'>
                        <p className='title'>{movie.title}</p>
                            <ul className='movie-facts'>
                                <li className='rated'>{movie.rated}</li>
                                <li className='year'>{movie.year}</li>
                                <li className='genres'>{movie.genres.map( (genre, index) => {
                                    if(index == movie.genres.length-1){
                                        return genre;
                                    }

                                    else{
                                        return genre + ", "
                                    }
                                })}</li>
                                <li className='runtime'>{movie.runtime}</li>
                            </ul>
                    </div>
    
                    <div className='movie-personnel'>
                        <p><b>Plot</b>: {movie.plot}</p>
                        <p><b>Actors: </b>{movie.actors.map( (actor, index) => {
                            if(index == movie.actors.length-1){
                                if(loggedInUser && loggedInUser.contributor){
                                    return  <><Link to={"/people/" + actor.name}><span>{actor.name}</span></Link>
                                                <FaPlus className='plus movie-icon' onClick={() => {
                                                    setModalSelection("actor");
                                                    setIsModalOpen(true);
                                                }}></FaPlus>
                                            </>
                                }

                                else{
                                    return <Link to={"/people/" + actor.name}><span>{actor.name}</span></Link>
                                }
                    
                            
                            }

                            else{
                                return <Link to={"/people/" + actor.name}><span>{actor.name + ", "}</span></Link>
                            }
                        })}</p>
                        <p><b>Writers: </b>{movie.writers.map( (writer, index) => {
                            if(index == movie.writers.length-1){
                                if(loggedInUser && loggedInUser.contributor){
                                    return  <><Link to={"/people/" + writer.name}><span>{writer.name}</span></Link>
                                                <FaPlus className='plus movie-icon' onClick={() => {
                                                    setModalSelection("writer");
                                                    setIsModalOpen(true);
                                                }}></FaPlus>
                                            </>
                                }

                                else{
                                    return <Link to={"/people/" + writer.name}><span>{writer.name}</span></Link>
                                }
                            }

                            else{
                                return <Link to={"/people/" + writer.name}><span>{writer.name + ", "}</span></Link>
                            }
                        })}</p>
                        <p className='directed'><b>Directed by: </b>
                            <Link to={"/people/"+movie.director.name}>{movie.director.name}</Link>
                                {loggedInUser && loggedInUser.contributor && 
                                <FaPencilAlt className='edit movie-icon' onClick={() => {
                                                        setModalSelection("director");
                                                        setIsModalOpen(true);
                                                    }}>					
                                </FaPencilAlt> }
                
                        </p>

                    </div>

                </div>



            </div>

            <div className='movie-bottom-page'>
                <div className='similar-movies-slider'>
                <p className='label'>Similar Movies</p>
                <Swiper 
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                breakpoints={{
                    // when window width >= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetweenSlides: 10
                    },
                    //when window width >= 520px
                    520: {
                        slidesPerView: 2,
                        spaceBetweenSlides: 10
                    },
                    // when window width >= 700px
                    700: {
                        slidesPerView: 3,
                        spaceBetweenSlides: 10
                    },
                    // when window width >= 1080px
                    1080: {
                        slidesPerView: 4,
                        spaceBetweenSlides: 10
                    },
                    // when window width is >= 1268px
                    1268: {
                        slidesPerView: 5,
                        spaceBetweenSlides: 10
                    } 
                }}
                navigation
                
                >
                        {movie.similarMovies.map( (similarMovie) => (
                            <SwiperSlide key={uuidv4()}>
                                <Link to={"/movies/"+ similarMovie.title} className='movie' key={uuidv4()}>        
                                    <img src={similarMovie.poster} onError={(event) => {event.target.src="/blankmovie.jpg"}}/>
                                    <p className='movie-title'>{similarMovie.title}</p>  
                                </Link>
                            </SwiperSlide> 
                        ))}
                    
                    </Swiper>
                </div>
                <br></br>
                <p className='title'>Reviews</p>
                <div className='movie-reviews'>
                    <div className='movie-review'>
                        <div className='movie-review-left'>
                            <div className='movie-reviewer-image'>
                                <img src="/blankpfp.png"></img>
                            </div>  
                            <p>Name</p>

                        </div>
                        <div className='movie-review-right'>
                            <p className='movie-review-summary'><b>Review Summary</b></p>
                            <div className='movie-review-rating'>
                                <span>9.5</span>
                                <FaStar></FaStar>
                            </div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse luctus, ipsum nec efficitur cursus, elit diam mattis ipsum, eget sagittis diam enim eget justo. Integer urna justo, scelerisque sed porttitor id, facilisis ut neque. Pellentesque dignissim efficitur suscipit. Sed quis libero eu lectus mollis lacinia non eget tellus. Nullam vitae mollis orci, sit amet maximus lacus. Pellentesque eu elit ut nulla posuere gravida. Suspendisse potenti. Sed suscipit nulla lectus, a laoreet dolor venenatis nec. Sed pulvinar orci et orci gravida sollicitudin. Proin pulvinar ante vel felis auctor feugiat. Maecenas tempus maximus malesuada. Nam sit amet tortor at diam tincidunt consectetur.
                        </div>
                
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} title={movie.title} role={modalSelection} toggleModal={toggleModal} updateParentPage={updatePage} ></Modal>
        </div>
    </>
  )
}

export default Movie