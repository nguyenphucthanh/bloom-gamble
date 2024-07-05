/* eslint-disable */
import { FC, useCallback, useState } from "react";
import IconVoice from "../icons/voice";

export interface IVoiceButtonProps {
  callback: (val: string) => void;
}

const VoiceButton: FC<IVoiceButtonProps> = ({ callback }) => {
  const [isListening, setIsListening] = useState(false);

  let recognition: any;
  if ("webkitSpeechRecognition" in window) {
    // @ts-ignore
    recognition = new webkitSpeechRecognition();
    // Set recognition parameters
    recognition.continuous = false; // Enable continuous recognition
    recognition.interimResults = false; // Enable interim results
    recognition.lang = "vi-VN";

    recognition.onresult = function (event: any) {
      var result = "";
      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          result += event.results[i][0].transcript;
        }
      }
      callback(result.trim());
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const startListening = useCallback(() => {
    recognition.start();
  }, [recognition]);

  return (
    recognition && (
      <div className="w-15 relative mx-2 flex h-11 sm:w-12">
        <span
          className={`${
            isListening ? "animate-ping" : ""
          } absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`}
        ></span>
        <button
          className="absolute inline-flex h-full w-full rounded-full bg-red-500"
          onClick={startListening}
          title="Start Listening"
        >
          <IconVoice />
        </button>
      </div>
    )
  );
};

export default VoiceButton;
