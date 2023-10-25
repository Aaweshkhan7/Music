import './App.css';
import NavBar from './components/NavBar'
import Showcase from './components/Showcase/Showcase'
import Footer from './components/Footer';
import Search from './components/Search';
import Player from './components/Player/Player';

import LoadingBar from 'react-top-loading-bar'
import { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Alert from './components/Alert';
import AlbumsShowcase from './components/Showcase/AlbumsShowcase';
import PlaylistsShowcase from './components/Showcase/PlaylistsShowcase';
import About from './components/About';
import Terms from './components/Terms';
import Results from './components/Results';
import MiniPlayer from './components/MiniPlayer';



function App() {
  const [progress, setProgress] = useState(0) //progress of loading bar
  const [details, setDetails] = useState(null)
  const [alert, setAlert] = useState(null)
  const [theme, setTheme] = useState("dark")

  const [albumId, setAlbumId] = useState(null)
  const [playlistId, setPlaylistId] = useState(null)

  const [query, setQuery] = useState(null)


  // const toggleTheme = () => {
  //   if (theme === "dark") {
  //     setTheme("")
  //     showAlert("Light mode has been enabled.")
  //   }
  //   else {
  //     setTheme("dark")
  //     showAlert("Dark mode has been enabled.")
  //     // document.documentElement.classlist.add("dark")
  //   }
  // }
  const toggleTheme = () => {
    const currentTheme = document.body.getAttribute("data-theme")
    if (currentTheme === "night") {
      document.body.setAttribute("data-theme", "emerald")
      showAlert("Light mode has been enabled.")
    }
    else {
      document.body.setAttribute("data-theme", "night")
      showAlert("Dark mode has been enabled.")
    }
  }

  const showAlert = (message) => {
    setAlert(message)
    setTimeout(() => {
      setAlert(null)
    }, 2000);
  }

  useEffect(() => {
    showAlert("By using TuneStation, you agree to be bound by the Terms of Use.")
  }, [])

  return (
    <div >
      <div>

        <LoadingBar
          color='#ff0000'
          progress={progress}
          height={3}
          shadow={false}
          onLoaderFinished={() => setProgress(0)}
        />
        <div>
          <Router>
            <NavBar toggleTheme={toggleTheme} />
            <Alert message={alert} />
            <Routes>

              <Route exact path="/" element={<Showcase setAlbumId={setAlbumId} setPlaylistId={setPlaylistId} setProgress={setProgress} setDetails={setDetails} />}> </Route>

              <Route exact path="/about" element={<About />}> </Route>

              <Route exact path="/terms" element={<Terms />}> </Route>

              <Route exact path="/albums" element={<AlbumsShowcase albumId={albumId} setProgress={setProgress} setDetails={setDetails} />}> </Route>

              <Route exact path="/playlists" element={<PlaylistsShowcase playlistId={playlistId} setProgress={setProgress} setDetails={setDetails} />}> </Route>

              <Route exact path="/search" element={<Search setProgress={setProgress} setQuery={setQuery} />}> </Route>

              <Route exact path="/results" element={<Results query={query} setProgress={setProgress} setDetails={setDetails} setAlbumId={setAlbumId} setPlaylistId={setPlaylistId} />}> </Route>

              <Route exact path="/listen" element={<Player showAlert={showAlert} setProgress={setProgress} details={details} />}> </Route>

              <Route exact path="/favs" element={<div>Coming soon!</div>}> </Route>

            </Routes>
            <MiniPlayer />
            <Footer />
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
