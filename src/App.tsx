import React, { useState, ChangeEvent, useEffect } from 'react';
import { ReactComponent as Logo } from './z-chars-logo.svg';
import './App.css';

import { encode, decode } from 'z-chars';

// 305 471

const placeholders = {
  message: "A message that can be seen",
  hidden: "A hidden message",
  decoded: "The decoded message",
  encoded: "Message with hidden message"
}

function App() {

  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const [subject, setSubject] = useState("");
  const [toEncode, setToEncode] = useState("");
  const [toDecode, setToDecode] = useState("");

  const [toCopy, setToCopy] = useState("");

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
    <main>

      <div className="Wall">
        <div className="App">
          <Logo className="Logo" />

          <div className="formWrapper">
            <form className={mode} onSubmit={e => e.preventDefault()}>
              <div>
                <textarea
                  placeholder={placeholders.message}
                  className="encode"
                  onChange={onSubjectUpdate}
                  value={subject} />
              </div>
              <div>
                <textarea
                  placeholder={placeholders.hidden}
                  className="encode"
                  onChange={onEncodeUpdate}
                  value={toEncode} />
              </div>
              <div>
                <textarea placeholder={mode === "decode" ? placeholders.decoded : placeholders.encoded}
                  className="copy"
                  value={toCopy}
                  readOnly />
                <button>Copy</button>
              </div>
              <div>
                <textarea
                  className="decode"
                  onChange={onDecodeUpdate}
                  value={toDecode} />
              </div>
            </form>
          </div>
          <footer>
            <button onClick={onEncodeMode}>← Encode</button>
            <button onClick={onDecodeMode}>Decode →</button>
          </footer>

        </div>
      </div>
    </main>
  );
}

export default App;
