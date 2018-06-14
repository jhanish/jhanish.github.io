
var gamePhrases = [
 {phrase: "Darth Vader", blurb: "If you don't know who this is, you've been living on the forest moon of Endor with the Ewoks for the last 40 years!"},
 {phrase: "Luke Skywalker", blurb: "One of the greatest Jedi to ever live.  Defeated Darth Vader, who also happened to be his Dad."},
 {phrase: "Jawa", blurb: "The tiny little brown cloaked yellow light eyed creatures on Tatooine, who ran a used droid outfit"},
 {phrase: "Han Solo", blurb: "Captain of the Millennium Falcon, smuggler, and outlaw"},
 {phrase: "Millennium Falcon", blurb: "Han Solo's iconic ship"},
 {phrase: "Boba Fett", blurb: "Han Solo's nemesis.  A ruthless bounty hunter working for the Empire"},
 {phrase: "Kylo Ren", blurb: "Darth Vader's grandson, Han Solo and Princess Leia's son, Luke Skywalker's nephew.  Of course this kid is a mess."},
 {phrase: "Po Dameron", blurb: "The best pilot in the resistance, AND supposedly the galaxy."},
 {phrase: "Slave One", blurb: "Boba Fett's iconic ship.  One of the coolest looking spaceship designs ever, and also looks kind of like his helmet, increasing it's awesomeness by at least 20%."},
 {phrase: "Supreme Leader Snoke", blurb: "His history is a mystery, but his name pretty much says it all.  Supreme baddy, got smacked down by his best student, Kylo.  Note to Kylo: Maybe skip the student thing, it doesn't always go so well for you guys."},
];

var vaderMessages = [
  "OH NO!  BABY VADER LEVEL 1!  ONLY 6 MORE!",
  "VADER LEVEL 2!  HE'S A YOUNG MAN!  WE'RE IN TROUBLE!",
  "LEVEL 3!  HE'S REALLY STARTING TO LOOK ANGRY!",
  "VADER LEVEL 4!  VADER IS SO MAD.  I'M SCARED.",
  "VADER LEVEL 5!  ONLY 2 MORE STAGES TO FULL VADER!",
  "LEVEL 6!  HE'S SUITED UP!  WE'RE DOOMED!"
];

function getNewPhrase() {
  // decide which phrase we want to use, by getting a randomized index

  // We're using random() to get a number between 0 and 1, which we scale
  // up to what we need by multiplying it by the number of items we have 
  // to pick from.  This will not be a whole number, so we use floor on it
  // to turn it into a non-floating point number that we can use as an index.

  // The main takeaway though, is if you use the formula below and put your
  // own number where gamePhrases.length is, you will get a random number 
  // between 0 and ONE LESS than the number you plug in, which is really
  // convenient for dealing with arrays, right?  :-)

  var choice_idx = Math.floor(Math.random() * gamePhrases.length);
  
  // This one line accomplishes a lot!  We are using our index choice, to pull
  // an object OUT of the array using the 'splice' function.  The splice 
  // function returns an array containing the items that were REMOVED during
  // the splice.  So, we wind up with an array of 1 element, the one that we 
  // chose randomly above.  This is why there is a [0] at the end of the statement,
  // because we need only that first element, we don't need to return an array
  // to our caller.
  var results = gamePhrases.splice(choice_idx, 1)[0];
  return results;
}

var lettersToWinGame = 0;
var guessedLetters = [];
var currentPhrase;
var displayString = '';
var vaderlevel = 0;

var audio = new Audio('assets/sounds/star-wars-theme-song.mp3');
var audio_vader_breath = new Audio('assets/sounds/vaderbreathe.mp3');
var audio_imperial_march = new Audio('assets/sounds/imperial_march.mp3');

//https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
var display = document.getElementById('phrase_display');
var blurb_display = document.getElementById('blurb_display');
var main_image = document.getElementById('main_image');


function restart() {
  audio.pause();
  audio_imperial_march.pause();
  audio_imperial_march = new Audio('assets/sounds/imperial_march.mp3');
  
  lettersToWinGame = 0;
  guessedLetters = [];
  currentPhrase = getNewPhrase();
  console.log(currentPhrase);
  displayString = '';
  vaderlevel = 0;
  main_image.src = "assets/images/poster.jpg";

  for (i = 0; i < currentPhrase.phrase.length; i++) {
    if (currentPhrase.phrase.charAt(i) !== " ") {
      displayString += "_";
      lettersToWinGame += 1;
    }
    else {
      displayString += " ";
    }
  }

  // https://www.w3schools.com/jsref/prop_node_textcontent.asp
  display.textContent = displayString;

  // Set the blurb text up top, to be the "blurb" member of our currentPhrase object
  blurb_display.textContent = currentPhrase.blurb;

}

document.onkeyup = function(event) {
  console.log(event.key);

  // Was this key already guessed?
  for (var i = 0; i < guessedLetters.length; i++) {
    if (guessedLetters[i] === event.key) {
      console.log("Key already guessed, bailing.");
      return;
    }
  }
  
  // Add this letter to the already guessed letters array
  guessedLetters.push(event.key);

  // See if this letter, was any of the letters in our phrase
  var tempstr = '';
  var correct_guess = false;

  for (var i = 0; i < currentPhrase.phrase.length; i++) {
    console.log("currentPhrase.phrase = " + currentPhrase.phrase);
    console.log(currentPhrase.phrase.charAt(i).toUpperCase());
    if ((currentPhrase.phrase.charAt(i).toUpperCase() == event.key) || 
        (currentPhrase.phrase.charAt(i).toLowerCase() == event.key)) {
        tempstr += currentPhrase.phrase.charAt(i);
        lettersToWinGame--;
        correct_guess = true;
        //alert("YOU GOT ONE!");
        main_image.src = "assets/images/poster.jpg";
    }
    else {
      tempstr += displayString.charAt(i);
    }
  }

  if (correct_guess === false) {

    audio_vader_breath.play();
    vaderlevel++;   
      main_image.src = "assets/images/vader" + vaderlevel + ".jpg";
      if (vaderlevel === 7) {
        audio_imperial_march.play();
        blurb_display.innerHTML = "<span class=\"lose-message\">YOU LOSE!  TRY AGAIN?</span><button class=\"msgbtn\" onclick=\"restart();\">YES</button>";  
      }
      else {
        blurb_display.innerHTML =  "<span class=\"vader-message\">" + vaderMessages[vaderlevel - 1] + "</span>";
      }
  }
  else {
    var blaster = new Audio('assets/sounds/blaster.mp3');
    blaster.play();
  }
  
  displayString = tempstr;
  display.textContent = displayString;

  if (lettersToWinGame === 0) {
    audio = new Audio('assets/sounds/star-wars-theme-song.mp3');
    audio.play();
    var message = "<span class=\"win-message\">NICE JOB!  YOU WIN!  START NEXT CHALLENGE?!</span><button class=\"msgbtn\" onclick=\"restart();\">YES</button>";
    blurb_display.innerHTML = message;
  }

}

restart();
