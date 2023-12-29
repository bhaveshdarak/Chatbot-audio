import React, { useState, useRef, useEffect } from 'react';
import AudioList from './AudioList';
import { useSpeechRecognition } from 'react-speech-recognition';
import './Chatbot.css';


const Chatbot = () => {
  const [audioMessages, setAudioMessages] = useState(() => {
    const storedAudioMessages = localStorage.getItem('audioMessages');
    return storedAudioMessages ? JSON.parse(storedAudioMessages) : [];
  });
  const audioRef = useRef(null);
  const { resetTranscript } = useSpeechRecognition();
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('audioMessages', JSON.stringify(audioMessages));
  }, [audioMessages]);

  const handleRecordingStop = (audioChunks) => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioMessages((prev) => [...prev, audioUrl]);
    setRecording(false);
  };

  const startRecording = () => {
    setRecording(true);
    resetTranscript();
    audioRef.current.src = null; 
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        handleRecordingStop(audioChunks);
      });

      mediaRecorder.start();
    });
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const eraseRecordings = () => {
    setAudioMessages([]);
  };

  return (
    <div className="chatbot">
      <h1>Chatbot PWA</h1>
      <AudioList audioMessages={audioMessages} audioRef={audioRef} />
      <div className="buttons">
        <button onClick={recording ? stopRecording : startRecording}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button onClick={eraseRecordings}>Erase Recordings</button>
      </div>
    </div>
  );
};

export default Chatbot;
