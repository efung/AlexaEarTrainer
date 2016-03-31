#!/usr/bin/ruby

# Based on
# https://github.com/mudcube/MIDI.js/blob/master/generator/ruby/soundfont_builder.rb

require 'midilib'
require 'midilib/consts'

# Semitone distance relative to C
NOTES = {
  "C"  => 0,
  "C#" => 1,
  "Db" => 1,
  "D"  => 2,
  "D#" => 3,
  "Eb" => 3,
  "E"  => 4,
  "F"  => 5,
  "F#" => 6,
  "Gb" => 6,
  "G"  => 7,
  "G#" => 8,
  "Ab" => 8,
  "A"  => 9,
  "A#" => 10,
  "Bb" => 10,
  "B"  => 11
}

# Using International Pitch Notation, e.g. middle C on a piano is C4
MIDI_C0 = 12
def note_to_midi_int(ipn)
	octave = ipn[-1,1].to_i
	note = ipn.chop
	return MIDI_C0 + NOTES[note] + (octave*12);
end

VELOCITY = 127
DURATION = Integer(1000)

def generate_midi(program, note_value, file)
  include MIDI
  seq = Sequence.new()
  track = Track.new(seq)

  track.events << Controller.new(0, CC_VOLUME, 127)

  seq.tracks << track
  track.events << ProgramChange.new(0, Integer(program))
  track.events << NoteOn.new(0, note_value, VELOCITY, 0) # channel, note, velocity, delta
  track.events << NoteOff.new(0, note_value, VELOCITY, DURATION)

  File.open(file, 'wb') { | f | seq.write(f) }
end


["C4", "C#4", "D4", "Eb4", "E4", "F4", "F#4", "G4", "Ab4", "A4", "Bb4", "B4", "C5"].each do |note|
   generate_midi(0, note_to_midi_int(note), "#{note}.mid")
end

["C3", "C#3", "D3", "Eb3", "E3", "F3", "F#3", "G3", "Ab3", "A3", "Bb3", "B3"].each do |note|
   generate_midi(0, note_to_midi_int(note), "#{note}.mid")
end
