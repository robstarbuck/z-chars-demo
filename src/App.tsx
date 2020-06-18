import React, { useState, ChangeEvent, useEffect, CSSProperties } from 'react';
import { ReactComponent as Logo } from './z-chars-logo.svg';
import './App.css';

import { useCopyToClipboard } from 'react-use';

import { encodeStatus, decodeStatus, status, ErrorStatus, mustEncode, mustDecode } from 'z-chars';

// 305 471

const placeholders = {
  original: "A. The original message",
  hidden: "B. A hidden message",
  encode: "C. The original plus the encoded message\n(A+B)",
  decode: "D. The decoded message",
  encoded: "E. An encoded message\n(Contents of C)",
}

const animationDuration = 100;
const animationIterationCount = 2;

const copyingStyle: CSSProperties = {
  animationIterationCount,
  animationDuration: `${animationDuration}ms`,
};

function App() {

  const [useCopy, setClipboard] = useCopyToClipboard();
  const [isCopying, setCopying] = useState(false);

  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const [subject, setSubject] = useState("");
  const [toEncode, setToEncode] = useState("");
  const [toDecode, setToDecode] = useState("");

  const [errorCode, setError] = useState<keyof typeof status>();

  const [toCopy, setToCopy] = useState("");

  useEffect(() => {
    const onError = (code: typeof errorCode) => {
      setToCopy("");
      if (code && status[code].level > ErrorStatus.INFO) {
        console.log(code, code && status[code].level);
        setError(code);
      }
    }

    if (mode === "encode") {
      const subjectTrimmed = subject.trim();
      const encodeTrimmed = toEncode.trim();

      const encodeStatusCode = encodeStatus(subjectTrimmed, encodeTrimmed);
      if (status[encodeStatusCode].valid) {
        setError(undefined);
        setToCopy(mustEncode(subjectTrimmed, encodeTrimmed));
      }else{
        onError(encodeStatusCode);
      }

    }
    if (mode === "decode") {
      const decodeStatusCode = decodeStatus(toDecode);
      if (status[decodeStatusCode].valid) {
        setError(undefined);
        setToCopy(mustDecode(toDecode));
      }else{
        onError(decodeStatusCode);
      }
    }
  }, [mode, subject, toEncode, toDecode, errorCode])

  console.log(errorCode);

  useEffect(() => {
    if (isCopying) {
      setClipboard(toCopy);
      setTimeout(() => setCopying(false), animationDuration * animationIterationCount);
    }
  }, [isCopying, toCopy, setClipboard]);

  const onEncodeMode = () => setMode("encode");
  const onDecodeMode = () => setMode("decode");

  const onCopy = () => setCopying(true);

  const onSubjectUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setSubject(e.currentTarget.value);
  const onEncodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setToEncode(e.currentTarget.value);
  const onDecodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => setToDecode(e.currentTarget.value);

  const error = errorCode && status[errorCode];
  const errorSubject = error?.errorFrom === "subject" ? <><span>⚠</span> {error.message}</> : undefined;
  const errorEncoded = error?.errorFrom === "encode" ? <><span>⚠</span> {error.message}</> : undefined;
  const errorDecoded = error?.errorFrom === "decode" ? <><span>⚠</span> {error.message}</> : undefined;

  return (
    <main className={mode}>

      <div className="App">

        <div className="formWrapper">
          <Logo className="Logo" />
          <form onSubmit={e => e.preventDefault()}>
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
              <textarea placeholder={placeholders[mode]}
                className={isCopying ? "copied" : undefined}
                style={copyingStyle}
                value={toCopy}
                readOnly />
              <button disabled={!toCopy || isCopying} onClick={onCopy}>Copy</button>
            </div>
            <div className="decode">
              <textarea
                onChange={onDecodeUpdate}
                value={toDecode} />
              <footer>{errorDecoded}</footer>
            </div>
          </form>
          <footer>
            <button className="encode" onClick={onEncodeMode}>← Encode</button>
            <button className="decode" onClick={onDecodeMode}>Decode →</button>
          </footer>
        </div>

      </div>
    </main>
  );
}

export default App;
