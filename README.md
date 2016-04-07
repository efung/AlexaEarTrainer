# Alexa Ear Trainer

This is an [Alexa
skill](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit)
that helps music students work on their [ear
training](https://en.wikipedia.org/wiki/Ear_training), specifically,
interval recognition.

Currently, you can say utterances like:

- Alexa, ask Ear Trainer to play a major third
- Alexa, ask Ear Trainer to play a perfect fifth descending
- Alexa, ask Ear Trainer to play a minor seventh ascending

## Supported Intervals
- Perfect unison
- Major/Minor second
- Major/Minor third
- Perfect fourth
- Augmented fourth/diminished fifth
- Major/Minor sixth
- Major/Minor seventh
- Perfect octave

# Usage
This skill is pending publication. It will hopefully be available mid-April 2016.

# Future Plans
- Quiz mode: ask skill to play an interval and you can guess it

# Building

## Prerequisites
- [FluidSynth](http://www.fluidsynth.org/). Mac users can install it
using `brew install fluid-synth`
- A SoundFont file, e.g. https://musescore.org/en/handbook/soundfont
- [LAME](http://lame.sourceforge.net/). On Mac, `brew install lame`
- [Node.js](https://nodejs.org/en/). On Mac, `brew install node`
- [Ruby](https://www.ruby-lang.org/en/)

## Instructions
- To create the individual sound files for each note, run
`scripts/make_midi_scale.sh`. This will generate a MIDI file for each
note between C3 and C5.
- These MIDI files need to be converted to the MP3 format that Alexa
[expects](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#audio).
Run `scripts/make_alexa_mp3.sh` and it will first convert all the MIDI files
into raw PCM WAV files via fluidsynth, and then LAME is used to turn
them into the correct MP3 format. 
- Next, you need to upload all of the MP3 files into Amazon S3, and make
the files public.
- To bundle the Alexa skill and upload it as a Lambda function, run `npm
install` from the `ear_trainer` folder. Then archive the `index.js` file and
`node_modules` folders into a zip. Note that I've used the [alexa-app](https://github.com/matt-kruse/alexa-app) framework, which has a few dependencies.


