import React from 'react';

const AudioList = ({ audioMessages, audioRef }) => {
  return (
    <div className="audio-list">
      <h3>Previous Audio Messages</h3>
      <ul>
        {audioMessages.map((audioUrl, index) => (
          <li key={index} onClick={() => audioRef.current.src = audioUrl}>
            <span>Recording {index + 1}</span>
            <audio controls src={audioUrl} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioList;
