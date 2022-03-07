import React, { useState, ChangeEvent, useEffect, CSSProperties } from "react";
import { ReactComponent as Logo } from "./z-chars-logo.svg";
import "./App.css";
import pkg from "../package.json";

import { useCopyToClipboard } from "react-use";

import {
  testEncode,
  testDecode,
  statusInfo,
  ErrorStatus,
  mustEncode,
  mustDecode,
} from "z-chars";

const placeholders = {
  subject: "A VISIBLE message",
  hidden: "A HIDDEN message",
  encode: "The VISIBLE and HIDDEN message combined",
  decode: "The decoded message",
  encoded: "An encoded message containing a HIDDEN message",
};

const animationDuration = 100;
const animationIterationCount = 2;

const copyingStyle: CSSProperties = {
  animationIterationCount,
  animationDuration: `${animationDuration}ms`,
};

type StatusValue = typeof statusInfo[keyof typeof statusInfo];
type ErrorValue = typeof statusInfo[Exclude<keyof typeof statusInfo, "OK">];

const showError = (status: StatusValue): status is ErrorValue => {
  return status.errorFrom ? status.errorLevel > ErrorStatus.INFO : false;
};

function App() {
  const [, setClipboard] = useCopyToClipboard();
  const [isCopying, setCopying] = useState(false);

  const params = new URLSearchParams(document.location.search);
  const decodeView = params.get("view") === "decode";

  const setForLovers = params.get("romantica") === "si";
  const removeForLovers = params.get("romantica") === "non";
  const forLovers = Boolean(localStorage.getItem('forLovers'));

  const title = forLovers
    ? "Steganografia per gli amanti 💖"
    : "Steganography using zero-width characters";

  if(forLovers) {
    document.body.classList.add("romantica");
  }

  if (setForLovers) {
    localStorage.setItem('forLovers', 'true');
  }
  if(removeForLovers) {
    localStorage.removeItem('forLovers');
  }
  if(setForLovers || removeForLovers) {
    params.delete('romantica');
    const relocateParams = params.toString() ? `?${params}` : '';
    window.location.href = `${window.location.pathname}${relocateParams}`
  }


  const [mode, setMode] = useState<"encode" | "decode">(
    decodeView ? "decode" : "encode"
  );

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
  }, [mode, subject, toEncode, toDecode, statusCode]);

  useEffect(() => {
    if (isCopying) {
      setClipboard(toCopy);
      setTimeout(
        () => setCopying(false),
        animationDuration * animationIterationCount
      );
    }
  }, [isCopying, toCopy, setClipboard]);

  const onEncodeMode = () => setMode("encode");
  const onDecodeMode = () => setMode("decode");

  const onCopy = () => setCopying(true);

  const onSubjectUpdate = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setSubject(e.currentTarget.value);
  const onEncodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setToEncode(e.currentTarget.value);
  const onDecodeUpdate = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setToDecode(e.currentTarget.value);

  const status = statusCode ? statusInfo[statusCode] : undefined;
  const error =
    status && showError(status)
      ? {
          [status.errorFrom]: (
            <>
              <span>⚠</span> {status.message}
            </>
          ),
        }
      : undefined;

  return (
    <main className={mode}>
      <div className="App">
        <div className="formWrapper">
          <header>
            <Logo className="Logo" />
            <p>{title}</p>
            <a href={pkg.repository.url}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  style={{ fill: "var(--logo, currentColor)" }}
                />
              </svg>
            </a>
          </header>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="encode">
              <textarea
                placeholder={placeholders.subject}
                onChange={onSubjectUpdate}
                value={subject}
              />
              <footer>{error?.subject}</footer>
            </div>
            <div className="encode">
              <textarea
                placeholder={placeholders.hidden}
                onChange={onEncodeUpdate}
                value={toEncode}
              />
              <footer>{error?.encode}</footer>
            </div>
            <div className="copy">
              <textarea
                placeholder={placeholders[mode]}
                className={isCopying ? "copied" : undefined}
                style={copyingStyle}
                value={toCopy}
                readOnly
              />
              <button disabled={!toCopy || isCopying} onClick={onCopy}>
                Copy {mode === "decode" ? "Decoded" : "Encoded"}
              </button>
            </div>
            <div className="decode">
              <textarea
                placeholder={placeholders.encoded}
                onChange={onDecodeUpdate}
                value={toDecode}
              />
              <footer>{error?.decode}</footer>
            </div>
          </form>
          <footer>
            <button className="encode" onClick={onEncodeMode}>
              ← Encode
            </button>
            <button className="decode" onClick={onDecodeMode}>
              Decode →
            </button>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default App;
