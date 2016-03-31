#!/bin/sh

for f in *.mid; do
    fluidsynth -F $f.wav FluidR3_GM.sf2 $f;
    lame -m j --scale 5 --resample 16 -b 48 $f.wav;
done
