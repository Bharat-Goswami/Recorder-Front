import { useState, useEffect } from 'react'
import { AddAudio } from './redux/audioSlice'
import {useDispatch} from 'react-redux'
import AudioList from './GetAudios'

import MicRecorder from 'mic-recorder-to-mp3'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

import { BsMic, BsStopFill, BsDatabaseFillAdd } from 'react-icons/bs'


const App = () => {

  const [state, setState] = useState({
    isRecording: false,
    mediaURL: "",
    isBlocked: false,
  });
  const [audio, setAudio] = useState('')

  const dispatch = useDispatch()

  const [recorder, setRecorder] = useState(new MicRecorder({ bitRate: 128 }))

  useEffect(() => {
    navigator.getUserMedia({ audio: true }, () => {
      setState({ isBlocked: false });},
      () => {
      toast.error('Please Allow Mic to Record')
      setState({ isBlocked: true });
      }
    );
  }, [])

  const startRecording = () => {
    if (state.isBlocked) {
      toast.error('Please turn on your microphone')
    } else {
      recorder
        .start()
        .then(() => {
          setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  const audioToBase64 = async (audioFile) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onerror = reject
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(audioFile)
    })
  }

  const stopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then( async([buffer, blob]) => {
        const mediaURL = URL.createObjectURL(blob)
        const file = new File(buffer, 'audio.mp3', {
          type: blob.type,
          lastModified: Date.now()
        })
        const base64Audio = await audioToBase64(file)
        setAudio(base64Audio)
        console.log(base64Audio)
        setState({ mediaURL, isRecording: false });
      }).catch((e) => console.log(e));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(AddAudio({ audio }));
    toast.success("Your audio is saved!");
    setAudio(""); // Clear audio state after saving
  };
  return (
    <>
      <form onSubmit={submitHandler} className="d-flex p-2 player">
        {state.isRecording ? (
          <a className="btn btn-outline-danger" onClick={stopRecording} disabled={!state.isRecording} style={{paddingTop: '12px'}}>
            <BsStopFill />
          </a>
        ) : (
          <a className="btn btn-outline-primary" onClick={startRecording} disabled={state.isRecording} style={{paddingTop: '12px'}}>
            <BsMic />
          </a>
        )}

        <audio src={state.mediaURL} value={audio} onChange={(e) => setState({audio: e.target.value})} controls autoPlay />
        <button type="submit" className="btn btn-light border">
          <BsDatabaseFillAdd />
        </button>
      </form>

      <AudioList />
      <ToastContainer />
    </>
  );
};

export default App;