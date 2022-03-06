import React, { useState, ChangeEvent, useEffect, CSSProperties } from 'react';
import { ReactComponent as Logo } from './z-chars-logo.svg';
import './App.css';

import { useCopyToClipboard } from 'react-use';

import { testEncode, testDecode, statusInfo, ErrorStatus, mustEncode, mustDecode } from 'z-chars';

const placeholders = {
  subject: "A VISIBLE message",
  hidden: "A HIDDEN message",
  encode: "The VISIBLE and HIDDEN message combined",
  decode: "The decoded message",
  encoded: "An encoded message containing a HIDDEN message",
}

const animationDuration = 100;
const animationIterationCount = 2;

const copyingStyle: CSSProperties = {
  animationIterationCount,
  animationDuration: `${animationDuration}ms`,
};

type StatusValue = typeof statusInfo[keyof typeof statusInfo]
type ErrorValue = typeof statusInfo[Exclude<keyof typeof statusInfo, "OK">]

const showError = (status: StatusValue): status is ErrorValue => {
  return status.errorFrom ? status.errorLevel > ErrorStatus.INFO : false;
};

function App() {

  const [, setClipboard] = useCopyToClipboard();
  const [isCopying, setCopying] = useState(false);

  const params = new URLSearchParams(document.location.search);
  const decodeView = params.get("view") === "decode";

  const forLovers = params.get("romantica") === "si";

  const title = forLovers ?
  'Steganography per gli amanti 💖' :
  'Steganography using zero-width characters';

  if(forLovers) {
    document.body.classList.add('romantica')
  }

  const [mode, setMode] = useState<"encode" | "decode">(decodeView ? "decode" : "encode");

  const [subject, setSubject] = useState("");
  const [toEncode, setToEncode] = useState("");
  const [toDecode, setToDecode] = useState("");

  const [statusCode, setStatus] = useState<keyof typeof statusInfo>();

  const [toCopy, setToCopy] = useState("");

  useEffect(() => {

    if (mode === "encode") {

      const subjectTrimmed = subject.trim();
      const encodeTrimmed = toEncode.trim();

      const encodeStatusCode = testEncode(subjectTrimmed, encodeTrimmed);
      setStatus(encodeStatusCode);

      if (statusInfo[encodeStatusCode].valid) {
        setToCopy(mustEncode(subjectTrimmed, encodeTrimmed));
      } else {
        setToCopy("");
      }

    }
    if (mode === "decode") {
      const decodeStatusCode = testDecode(toDecode);
      setStatus(decodeStatusCode);

      if (statusInfo[decodeStatusCode].valid) {
        setToCopy(mustDecode(toDecode));
      } else {
        setToCopy("");
      }
    }
  }, [mode, subject, toEncode, toDecode, statusCode])

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

  const status = statusCode ? statusInfo[statusCode] : undefined;
  const error = (status && showError(status)) ?
    ({ [status.errorFrom]: <><span>⚠</span> {status.message}</> })
    : undefined;

  return (
    <main className={mode}>

      <div className="App">

        <div className="formWrapper">
          <header>
            <Logo className="Logo" />
            <p>{title}</p>
          </header>
          <form onSubmit={e => e.preventDefault()}>
            <div className="encode">
              <textarea
                placeholder={placeholders.subject}
                onChange={onSubjectUpdate}
                value={subject} />
              <footer>{error?.subject}</footer>
            </div>
            <div className="encode">
              <textarea
                placeholder={placeholders.hidden}
                onChange={onEncodeUpdate}
                value={toEncode} />
              <footer>{error?.encode}</footer>
            </div>
            <div className="copy">
              <textarea
                placeholder={placeholders[mode]}
                className={isCopying ? "copied" : undefined}
                style={copyingStyle}
                value={toCopy}
                readOnly />
              <button disabled={!toCopy || isCopying} onClick={onCopy}>
                Copy {mode === "decode" ? "Decoded" : "Encoded"}
              </button>
            </div>
            <div className="decode">
              <textarea
                placeholder={placeholders.encoded}
                onChange={onDecodeUpdate}
                value={toDecode} />
              <footer>{error?.decode}</footer>
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
