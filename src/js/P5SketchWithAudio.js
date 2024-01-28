import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import Flower from './classes/Flower.js';

import audio from "../audio/flowers-no-2.ogg";
import midi from "../audio/flowers-no-2.mid";

/**
 * Flowers No. 2
 */
const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[5].notes; // Synth 2 - Clockenspiel
                    const noteSet2 = result.tracks[3].notes; // Synth 1 - Analog Replicant
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        }

        p.hueSet = [30, 90, 150, 210, 270, 330];
        
        p.bgHue = 0;

        p.bgSaturation = 30;
        
        p.bgBrightness = 50;

        p.flowers = Array(20).fill(null);

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.bgHue = p.random(p.hueSet);
            p.colorMode(p.HSB);
            p.background(p.bgHue, p.bgSaturation, p.bgBrightness);
            p.stroke(0, 0, 100);
            p.noLoop();
        }

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){
                p.background(p.bgHue, p.bgSaturation, p.bgBrightness);
                for (let i = 0; i < p.flowers.length; i++) {
                    const flower = p.flowers[i];
                    if(flower) {
                        flower.draw();    
                    }
                }
            }
        }

        p.getNextCoordinates = () => {
            let x, y, overlapping = true;
            do {
                x = p.random(p.width / 8, p.width - p.width / 8);
                y = p.random(p.height / 8, p.height - p.height / 8);
                // Check for overlapping positions
                overlapping = p.flowers.some(flower => {
                    if (flower) {
                        const d = p.dist(x, y, flower.x, flower.y);
                        return d < flower.pistilRadius * 2; // You may adjust this threshold
                    }
                    return false; // Handle null flower
                });
            } while (overlapping);

            return { x, y };
        };


        p.executeCueSet1 = (note) => {
            const { currentCue } = note;
            if(currentCue % 10 === 1) {
                p.clear();
                p.flowers = Array(20).fill(null);
            }
            let coOrds = p.getNextCoordinates();
            const hue = p.random(p.hueSet.filter(hue => hue !== p.bgHue));
            p.flowers[(currentCue % 10 - 1)] =
                new Flower(
                    p,
                    coOrds.x,
                    coOrds.y,
                    hue
                );
            p.draw();
            setTimeout(
                function () {
                    coOrds = p.getNextCoordinates();
                    p.flowers[(currentCue % 10 - 1) + 10] =
                        new Flower(
                            p,
                            coOrds.x,
                            coOrds.y,
                            hue + p.random(-30, 30)
                        );
                    p.draw();
                },
                433
            );
        }

        p.executeCueSet2 = (note) => {
            const { currentCue } = note;
            p.bgSaturation = p.bgSaturation + 10;
            p.bgBrightness = p.bgBrightness + 5;
            if(currentCue % 6 === 0){
                p.bgHue = p.random(p.hueSet.filter(hue => hue !== p.bgHue));
                p.bgSaturation = 30;
                p.bgBrightness = 50;
            }
            p.draw();
        }

        p.hasStarted = false;

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                        if (typeof window.dataLayer !== typeof undefined){
                            window.dataLayer.push(
                                { 
                                    'event': 'play-animation',
                                    'animation': {
                                        'title': document.title,
                                        'location': window.location.href,
                                        'action': 'replaying'
                                    }
                                }
                            );
                        }
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                    if (typeof window.dataLayer !== typeof undefined && !p.hasStarted){
                        window.dataLayer.push(
                            { 
                                'event': 'play-animation',
                                'animation': {
                                    'title': document.title,
                                    'location': window.location.href,
                                    'action': 'start playing'
                                }
                            }
                        );
                        p.hasStarted = false
                    }
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
