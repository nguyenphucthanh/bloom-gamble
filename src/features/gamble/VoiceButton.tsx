import { FC, useCallback, useEffect, useState } from "react"

export interface IVoiceButtonProps {
  callback: (val: string) => void
}

const VoiceButton: FC<IVoiceButtonProps> = ({ callback }) => {
  const [isListening, setIsListening] = useState(false)

  let recognition: any
  if ("webkitSpeechRecognition" in window) {
    // @ts-ignore
    recognition = new webkitSpeechRecognition()
    // Set recognition parameters
    recognition.continuous = false // Enable continuous recognition
    recognition.interimResults = false // Enable interim results
    recognition.lang = "vi-VN"

    recognition.onresult = function (event: any) {
      var result = ""
      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          result += event.results[i][0].transcript
        }
      }
      callback(result.trim())
      console.log(result)
    }

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }

  const startListening = useCallback(() => {
    recognition.start()
  }, [recognition])

  return (
    recognition && (
      <div className="w-15 relative flex h-11 sm:w-12 mx-2">
        <span
          className={`${
            isListening ? "animate-ping" : ""
          } absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`}
        ></span>
        <button
          className="absolute inline-flex rounded-full h-full w-full bg-red-500"
          onClick={startListening}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#fff"
            viewBox="0 0 34.918 34.918"
            className="w-5 h-5 top-3 left-3 absolute"
          >
            <g>
              <path
                d="M26.834,10.375h-3v-4C23.834,2.86,20.975,0,17.459,0c-3.516,0-6.375,2.86-6.375,6.375v4h-3c-0.552,0-1,0.448-1,1v4.5
c0,5.253,3.93,9.598,9.002,10.273c-0.081,0.184-0.127,0.387-0.127,0.602v5.168h-4c-0.829,0-1.5,0.67-1.5,1.5
c0,0.828,0.671,1.5,1.5,1.5h11c0.828,0,1.5-0.672,1.5-1.5c0-0.83-0.672-1.5-1.5-1.5h-4V26.75c0-0.213-0.047-0.416-0.127-0.602
c5.072-0.676,9.002-5.021,9.002-10.273v-4.5C27.834,10.821,27.386,10.375,26.834,10.375z M25.834,15.875
c0,4.619-3.758,8.375-8.375,8.375c-4.618,0-8.375-3.756-8.375-8.375v-3.5h2v3.5c0,3.516,2.859,6.375,6.375,6.375
c3.516,0,6.375-2.859,6.375-6.375v-3.5h2V15.875z"
              />
            </g>
          </svg>
        </button>
      </div>
    )
  )
}

export default VoiceButton
