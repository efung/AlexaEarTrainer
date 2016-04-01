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

function get_note_from_interval(interval, direction) {
  semitone_interval = INTERVAL_DISTANCES[interval] * ((direction === "ascending") ? 1 : -1);
  for (var note in NOTE_OFFSETS) {
    if ( NOTE_OFFSETS[note] == semitone_interval ) {
      return note;
    }
  }
}

app.dictionary = {"directions": ["", "ascending", "descending"]};

app.launch(function(req,res) {
	res.say("Welcome to Ear Trainer. " +
          "You can ask me to play any interval in the octave by saying, Play a perfect fourth, or, Play a minor seventh descending.");
});
app.intent('PlayIntervalIntent', {
		"slots":{"INTERVAL":"LITERAL", "DIRECTION":"LITERAL"}
		,"utterances":[
        "play a {" +
        Object.keys(ALL_INTERVALS).join('|') +
        "|INTERVAL} " +
        "{ascending|descending|DIRECTION}"]
	},function(req,res) {
    if ( req.slot('INTERVAL') in ALL_INTERVALS ) {
       direction = "ascending";
       if ( !isEmpty(req.slot('DIRECTION')) ) {
         direction = req.slot('DIRECTION');
       }

       first_note = get_note_ssml("C4");
       second_note = get_note_ssml(get_note_from_interval(req.slot('INTERVAL'), direction));
       res.say('Here is ' + (beginsWithVowel(req.slot('INTERVAL')) ? 'an ' : 'a ') +
               req.slot('INTERVAL') + ' ' + direction + ' <break/> ' +
               first_note + ' ' + second_note);
       res.shouldEndSession(true);
    } else {
		  res.say('I didn\'t understand what you said. Try again.');
      res.shouldEndSession(true);
    }
	}
);


module.exports = app;