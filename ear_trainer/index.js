var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('ear_trainer');

function get_note_ssml(note) {
  return '<audio src="https://s3.amazonaws.com/pianosounds/' + note.replace(/#/g, '%23') + '.mid.mp3" /> ';
}

INTERVAL_DISTANCES = {
  "perfect unison": 0,
  "minor second": 1,
  "major second": 2,
  "minor third": 3,
  "major third": 4,
  "perfect fourth": 5,
  "augmented fourth": 6,
  "diminished fifth": 6,
  "perfect fifth": 7,
  "minor sixth": 8,
  "major sixth": 9,
  "minor seventh": 10,
  "major seventh": 11,
  "perfect octave": 12
}

ALL_INTERVALS = INTERVAL_DISTANCES;

// Note offsets are semitone distances relative to middle C (C4)
NOTE_OFFSETS = {
  "C3": -12,
  "C#3": -11,
  "D3": -10,
  "Eb3": -9,
  "E3": -8,
  "F3": -7,
  "F#3": -6,
  "G3": -5,
  "Ab3": -4,
  "A3": -3,
  "Bb3": -2,
  "B3": -1,
  "C4": 0,
  "C#4": 1,
  "D4": 2,
  "Eb4": 3,
  "E4": 4,
  "F4": 5,
  "F#4": 6,
  "G4": 7,
  "Ab4": 8,
  "A4": 9,
  "Bb4": 10,
  "B4": 11,
  "C5": 12
}

function isEmpty(str) {
      return (!str || 0 === str.length);
}

function beginsWithVowel(str) {
    return (/^[aeiou]/i).test(str);
}

function prefixStringWithAOrAn(word) {
    return beginsWithVowel(word) ? ("an " + word) : ("a " + word);
}

function removeAOrAnPrefix(phrase) {
    return phrase.replace(/^an? /, "");
}

function get_note_from_interval(interval, direction) {
  semitone_interval = INTERVAL_DISTANCES[interval] * ((direction === "ascending") ? 1 : -1);
  for (var note in NOTE_OFFSETS) {
    if ( NOTE_OFFSETS[note] == semitone_interval ) {
      return note;
    }
  }
}

app.exhaustiveUtterances = true;
app.dictionary = {"directions": ["ascending", "descending"]};

var prompt = "Here are some things you can say. Play a minor seventh, or, play an augmented fourth descending."
app.launch(function(req,res) {
	res.say("Welcome to Ear Trainer. " +
          "You can ask me to play any interval in the octave, ascending or descending. Which interval should I play?");
  res.shouldEndSession(false, prompt);
});
app.intent('PlayIntervalIntent', {
		"slots":{"INTERVAL":"LITERAL", "DIRECTION":"LITERAL"}
		,"utterances":[
        "play {" + Object.keys(ALL_INTERVALS).map(prefixStringWithAOrAn).join('|') + "|INTERVAL} " + "{ascending|descending|DIRECTION}",
        "play {" + Object.keys(ALL_INTERVALS).map(prefixStringWithAOrAn).join('|') + "|INTERVAL} " 
    ]
	},function(req,res) {
    interval = removeAOrAnPrefix(req.slot('INTERVAL'));
    if ( interval in ALL_INTERVALS ) {
       direction = "ascending";
       if ( !isEmpty(req.slot('DIRECTION')) ) {
         direction = req.slot('DIRECTION');
       }
       if ( app.dictionary.directions.indexOf(direction) > -1 ) {
         first_note = get_note_ssml("C4");
         second_note = get_note_ssml(get_note_from_interval(interval, direction));
         res.say('Here is ' + prefixStringWithAOrAn(interval) +
                 ' ' + direction + ' <break/> ' +
                 first_note + ' ' + second_note);
         res.shouldEndSession(true);
         return;
       }
    }

    res.shouldEndSession(false, "I didn\'t understand that. " + prompt);
	}
);


module.exports = app;
