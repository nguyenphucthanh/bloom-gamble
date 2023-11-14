const isSpeechSupport = typeof SpeechSynthesisUtterance !== "undefined";
let voices = [];
const speech = isSpeechSupport ? new SpeechSynthesisUtterance() : null;
if (speech) {
  speech.lang = "vi-VN";
  speech.rate = 2;
  window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();

    speech.voice = voices.find((item) => item.lang === "vi-VN") ?? voices[0];
  };
}

export const speak = (content: string) => {
  if (!isSpeechSupport || !speech) {
    return;
  }

  speech.text = content;
  window.speechSynthesis.speak(speech);
};
