import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";

function Player(props) {
    // Download Functions 
    /**
     * Helper function for downloadSong
     * @param {} blob The blobURL of the song.
     * @param {string} filename The name with which to download the file.
     */
    const downloadBlob = (blob, filename) => {
        var a = document.createElement('a');
        a.download = filename;
        a.href = blob;
        document.body.appendChild(a);
        props.setProgress(90)
        a.click();
        a.remove();
        props.setProgress(100)
    }

    /**
     * Starts downloading the song from link send in props.
     */
    const downloadSong = async () => {
        props.showAlert(`Downloading ${props.details.name}...`)
        props.setProgress(10)

        const url = props.details.downloadUrl[4]["link"]

        const filename = props.details.name + " - TuneStation.mp3"

        const response = await fetch(url)

        props.setProgress(50)
        const blob = await response.blob()

        props.setProgress(70)
        let blobUrl = window.URL.createObjectURL(blob);
        downloadBlob(blobUrl, filename);

    }



    const navigate = useNavigate(); //for navigating to /search if details are not supplied

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!props.details) {
            navigate("/search")
            return
        }
        document.title = `Playing ${props.details.name} - TuneStation`
        const audio = audioRef.current;
        document.getElementById("player").scrollIntoView(true)
        audio.addEventListener('loadedmetadata', () => {
            setIsPlaying(true)
            setDuration(audio.duration);
            audio.play();
        });

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentTime(0);
            audio.currentTime = 0;
        });

        return () => {
            audio.removeEventListener('loadedmetadata', () => { });
            audio.removeEventListener('timeupdate', () => { });
            audio.removeEventListener('ended', () => { });
        }
    }, []);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            document.title = `Paused ${props.details.name} - TuneStation`
            audio.pause();
            setIsPlaying(false);
        } else {
            document.title = `Playing ${props.details.name} - TuneStation`
            audio.play();
            setIsPlaying(true);
        }
    }

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const seekTime = (duration / 100) * e.target.value;
        audio.currentTime = seekTime;
    }

    const handlePrevious = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        setCurrentTime(0);
    }

    const handleNext = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        setCurrentTime(0);
    }

    const currentMins = Math.floor(currentTime / 60);
    const currentSecs = Math.floor(currentTime % 60);
    const durationMins = Math.floor(duration / 60);
    const durationSecs = Math.floor(duration % 60);


    return (
        <>
            {/* Show player only if details are recieved */}
            {props.details && <section className="text-gray-400 bg-deep-900 body-font px-4" id="player">
                <div className="min-h-screen bg-deep-900 flex flex-col items-center justify-center">
                    <div className="max-w-xl bg-deep-900 rounded-lg shadow-lg overflow-hidden">
                        <div className="relative">
                            <img id="thumbnail" className="w-full h-96 object-cover"
                                src={props.details.image[2]["link"]}
                            />
                            <div
                                className="absolute p-4 inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-gray-900 backdrop backdrop-blur-5 text-white">
                                <h3 className="font-bold" id="songName">{props.details.name}</h3>
                                <p className="w-fit opacity-70" id="artists_marquee">{props.details.primaryArtists}</p>
                            </div>
                        </div>
                        <audio ref={audioRef} src={props.details.downloadUrl[4]["link"]} />

                        {/* Slider  */}
                        <div>
                            <input onChange={handleSeek} min="0" max="100" value={(currentTime / duration) * 100} type="range" className="w-full accent-green-600" name="slider" id="slider" />
                        </div>


                        <div className="flex justify-between text-xs font-semibold text-gray-500 px-4 py-2">
                            <div id="currentTime">
                                {currentMins}:{currentSecs < 10 ? '0' : ''}{currentSecs}
                            </div>

                            {/* Controls  */}
                            <div className="flex space-x-3 p-2">
                                <button className="focus:outline-none" id="previous" onClick={handlePrevious}>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                                        <line x1="5" y1="19" x2="5" y2="5"></line>
                                    </svg>
                                </button>
                                <button
                                    className="rounded-full w-12 h-12 flex items-center justify-center pl-0.5 ring-2 ring-gray-100 focus:outline-none hover:animate-pulse"
                                    id="controlBtn" onClick={handlePlayPause}>



                                    {/* Play :  */}
                                    {isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                        stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                    </svg>}

                                </button>
                                <button className="focus:outline-none" id="next" onClick={handleNext}>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                                        <line x1="19" y1="5" x2="19" y2="19"></line>
                                    </svg>
                                </button>
                            </div>
                            {/* End of Controls  */}

                            <div id="endTime">
                                {durationMins}:{durationSecs < 10 ? '0' : ''}{durationSecs}
                            </div>

                        </div>
                        <ul className="text-xs sm:text-base divide-y border-t cursor-default">
                            <li className="flex items-center space-x-3">
                                <button className="p-3 group focus:outline-none" id="favBtn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                        stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>


                                </button>

                                <div className="flex-1">

                                </div>
                                Download
                                <button className="focus:outline-none pr-4 group" id="downloadBtn" onClick={downloadSong}>
                                    <svg className="w-4 h-4 group-hover:text-white " viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
                                    </svg>
                                </button>
                            </li>
                            <li className="h-auto text-right text-lg pt-2">
                                <p className="pr-8 pb-2" id="copyrights_label">{props.details.copyright}</p>

                            </li>

                        </ul>
                    </div>
                </div>
            </section>}

        </>
    )
}

export default Player
