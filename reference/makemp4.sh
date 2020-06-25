#!/bin/bash

file=$1
ffmpeg -i $file -vcodec h264 -acodec mp2 "${file%.mov}.mp4" 

