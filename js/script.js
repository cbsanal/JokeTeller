// Elements
const audioElement = document.getElementById("audio");
const button = document.getElementById("btn");
const jokeText = document.querySelector(".joke");
const jokeAnswer = document.querySelector(".answer");
const counterElement = document.querySelector(".counter");
const voices = document.querySelector("#voices");
const jokeOptions = document.querySelector("#joke-options");

// Variables
let joke = "";
let answerOfJoke = "";
let answerBoolean = false;
let counter = 5;
let voice = "";
let hl = "";
let jokeOpt = "";

// Disable/Enable Button
function toggleButton() {
  button.disabled = !button.disabled;
}

// Passing Joke to VoiceRSS API
function tellJoke(joke, voice, hlTemp) {
  VoiceRSS.speech({
    key: "49190221de8a48bfa264a5ee853f7b67",
    src: joke,
    hl: hlTemp,
    v: voice,
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

// Get Jokes from API
async function getJokes() {
  counterElement.innerText = `${counter}`;
  answerBoolean = false;
  jokeAnswer.innerText = `Answer...`;
  jokeOpt = jokeOptions.value;
  const apiUrl = `https://v2.jokeapi.dev/joke/${jokeOpt}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart`;
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    joke = data.setup;
    answerOfJoke = data.delivery;
    // Text to Speech
    voice = voices.value;
    if (voice == "Alice") hl = "en-gb";
    else if (voice == "Eka") hl = "en-in";
    else if (voice == "Linda") hl = "en-us";
    else hl = "en-au";
    tellJoke(joke, voice, hl);
    jokeText.style.animation = "none";
    jokeText.offsetHeight; /* trigger reflow */
    jokeText.style.animation = null;
    jokeText.style.animation = "opacity 3.5s ease";
    jokeText.innerText = `${joke}`;
    // Disable Button
    toggleButton();
  } catch (error) {
    console.log("Error:", error);
  }
}
function count() {
  if (counter !== 0) {
    --counter;
    counterElement.innerText = `${counter}`;
    setTimeout(count, 1000);
  }
}

// Event Listeners
button.addEventListener("click", getJokes);
audioElement.addEventListener("ended", () => {
  if (answerBoolean === false) {
    count();
    setTimeout(() => tellJoke(answerOfJoke, voice, hl), 5000);
    setTimeout(() => {
      jokeAnswer.style.animation = "none";
      jokeAnswer.offsetHeight; /* trigger reflow */
      jokeAnswer.style.animation = null;
      jokeAnswer.style.animation = "opacity 2s ease";
      jokeAnswer.innerText = `${answerOfJoke}`;
    }, 5000);
    answerBoolean = true;
  } else {
    toggleButton();
    counter = 5;
  }
});
