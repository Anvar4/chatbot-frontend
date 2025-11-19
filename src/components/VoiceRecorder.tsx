import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaPause } from "react-icons/fa";

interface Props {
  onStop: (blob: Blob) => void;
}

const VoiceRecorder: React.FC<Props> = ({ onStop }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]); 

  useEffect(() => {
    const setupRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

        setMediaRecorder(recorder);

        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data); 
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

          onStop(blob);

          audioChunksRef.current = [];
        };
      } catch (err) {
        console.error("Mikrofon xatosi:", err);
      }
    };

    setupRecorder();
  }, [onStop]);

  const startRecording = () => {
    if (!mediaRecorder) return;
    audioChunksRef.current = [];    
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`px-6 py-5 rounded-lg font-semibold transition ${
        recording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {recording ? <FaPause className="mx-auto" /> : <FaMicrophone className="mx-auto" />}
    </button>
  );
};

export default VoiceRecorder;
