import React, { useState, ChangeEvent, useEffect } from 'react';
import './App.css';

import {encode, decode} from 'z-chars';


function App() {
  
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const [subject, setSubject] = useState("");
  const [toEncode, setToEncode] = useState("");
  const [toDecode, setToDecode] = useState("");

  const [toCopy, setToCopy] = useState("");

  const onModeToggle = () => setMode(m => m === "encode" ? "decode" : "encode")

  const onSubjectUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setSubject(e.currentTarget.value);
  const onEncodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setToEncode(e.currentTarget.value);
  const onDecodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setToDecode(e.currentTarget.value);

  useEffect(() => {
    if(mode ==="encode"){
      setToCopy(encode(subject, toEncode));
    }
    if(mode ==="decode"){
      setToCopy(decode(toDecode));
    }
  }, [mode, subject, toEncode, toDecode])

  return (
    <div className="Wall">
      <div className="App">
        <textarea onChange={onSubjectUpdate} value={subject} />
        <textarea onChange={onEncodeUpdate} value={toEncode} />

        <textarea value={toCopy} />

        <textarea onChange={onDecodeUpdate} value={toDecode} />

        <footer>
          <code onClick={onModeToggle}>{mode === "encode" ? "ENCODE" : "DECODE"}</code>
        </footer>
      </div>
    </div>
  );
}

export default App;