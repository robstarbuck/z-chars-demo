import React, { useState, ChangeEvent, useEffect } from 'react';
import { ReactComponent as Logo } from './z-chars-logo.svg';
import './App.css';

import { encode, decode, canEncode, errors, ErrorLevel } from 'z-chars';

// 305 471

const placeholders = {
  original: "A. The original message",
  hidden: "B. A hidden message",
  encodeResult: "C. The original plus the encoded message\n(A+B)",
  decodeResult: "D. The decoded message",
  encoded: "E. An encoded message\n(Contents of C)",
}

function App() {

  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const [subject, setSubject] = useState("");
  const [toEncode, setToEncode] = useState("");
  const [toDecode, setToDecode] = useState("");

  const [errorCode, setError] = useState<keyof typeof errors>();

  const [toCopy, setToCopy] = useState("");

  useEffect(() => {
    if (mode === "encode") {
      const onError = (code: typeof errorCode) => code && errors[code].level > ErrorLevel.INFO
        ? setError(code) : undefined;
      const subjectTrimmed = subject.trim();
      const encodeTrimmed = toEncode.trim();

      if (canEncode(subjectTrimmed, encodeTrimmed, onError)) {
        setError(undefined);
        setToCopy(encode(subjectTrimmed, encodeTrimmed));
      }

    }
    if (mode === "decode") {
      setToCopy(decode(toDecode));
    }
  }, [mode, subject, toEncode, toDecode, errorCode])


  const onEncodeMode = () => setMode("encode");
  const onDecodeMode = () => setMode("decode");

  const onSubjectUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setSubject(e.currentTarget.value);
  const onEncodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setToEncode(e.currentTarget.value);
  const onDecodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setToDecode(e.currentTarget.value);

  const error = errorCode && errors[errorCode];
  const errorSubject = error?.from === "original" ? `⚠ ${error.message}` : undefined;
  const errorEncoded = error?.from === "hidden" ? `⚠ ${error.message}` : undefined;
  const errorDecoded = error?.from === "encoded" ? `⚠ ${error.message}` : undefined;

  return (
    <main>

      <div className="Wall">
        <div className="App">
          <Logo className="Logo" />

          <div className="formWrapper">
            <form className={mode} onSubmit={e => e.preventDefault()}>
              <div className="encode">
                <textarea
                  placeholder={placeholders.original}
                  onChange={onSubjectUpdate}
                  value={subject} />
                <footer>{errorSubject}</footer>
              </div>
              <div className="encode">
                <textarea
                  placeholder={placeholders.hidden}
                  onChange={onEncodeUpdate}
                  value={toEncode} />
                <footer>{errorEncoded}</footer>
              </div>
              <div className="copy">
                <textarea placeholder={mode === "decode" ? placeholders.decodeResult : placeholders.encodeResult}
                  value={toCopy}
                  readOnly />
                <button>Copy</button>
              </div>
              <div className="decode">
                <textarea
                  onChange={onDecodeUpdate}
                  value={toDecode} />
                <footer>{errorDecoded}</footer>
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
