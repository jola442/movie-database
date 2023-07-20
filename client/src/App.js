import { Route, Routes } from "react-router-dom"
import DesktopNavbar from './components/DesktopNavbar';
import Home from "./pages/Home";
import Movies from './pages/Movies';
import Movie from './pages/Movie';
import Login from './pages/Login'; 
import MobileNavbar from "./components/MobileNavbar";
import Person from "./pages/Person";
import User from "./pages/User";
import People from "./pages/People";
import Users from "./pages/Users";
import { useState, useMemo } from "react";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  

  const value = useMemo( () => ( {loggedInUser, setLoggedInUser} ), [loggedInUser, setLoggedInUser]);

  return (
    <>
        <DesktopNavbar />
        <MobileNavbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/movies" element={<Movies/>}/>
          <Route path="/people" element={<People/>}/>
          <Route path="/users" element={<Users/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/movies/:title" element={<Movie/>}/>
          <Route path="/people/:name" element={<Person/>}/>
          <Route path="/users/:username" element={<User/>}/>
        </Routes>

    </>

  );
}

export default App;
