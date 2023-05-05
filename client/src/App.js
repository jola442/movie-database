import { Route, Routes } from "react-router-dom"
import DesktopNavbar from './components/DesktopNavbar';
import Home from "./pages/Home";
import Movies from './pages/Movies';
import Movie from './pages/Movie';
import Login from './pages/Login'; 
import MobileNavbar from "./components/MobileNavbar";
import Person from "./pages/Person";


function App() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/movies" element={<Movies/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/movies/:title" element={<Movie/>}/>
        <Route path="/people/:name" element={<Person/>}/>
      </Routes>
    </>

  );
}

export default App;
