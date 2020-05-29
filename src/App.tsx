import React, { useState, ChangeEvent, useEffect } from 'react';
import './App.css';

import { encode, decode } from 'z-chars';


function App() {

  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const [subject, setSubject] = useState("");
  const [toEncode, setToEncode] = useState("");
  const [toDecode, setToDecode] = useState("");

  const [toCopy, setToCopy] = useState("");

  const onToggleMode = () => setMode(m => m === "encode" ? "decode" : "encode")

  const onEncodeMode = () => setMode("encode");
  const onDecodeMode = () => setMode("decode");

  const onSubjectUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setSubject(e.currentTarget.value);
  const onEncodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setToEncode(e.currentTarget.value);
  const onDecodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setToDecode(e.currentTarget.value);

  useEffect(() => {
    if (mode === "encode") {
      setToCopy(encode(subject.trim(), toEncode.trim()));
    }
    if (mode === "decode") {
      setToCopy(decode(toDecode));
    }
  }, [mode, subject, toEncode, toDecode])

  return (
    <div className="Wall">

      <button onClick={onEncodeMode}>← Encode</button>
      <button onClick={onDecodeMode}>Decode →</button>

      <div className="App">
        <form className={mode} onSubmit={e => e.preventDefault()}>
          <div>
            <textarea className="encode" onChange={onSubjectUpdate} value={subject} />
          </div>
          <div>
            <textarea className="encode" onChange={onEncodeUpdate} value={toEncode} />
          </div>
          <div>
            <textarea className="copy" value={toCopy} />
            <button>Copy</button>
          </div>
          <div>
            <textarea className="decode" onChange={onDecodeUpdate} value={toDecode} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
