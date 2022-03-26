import './App.css';
import React, { useState, useEffect } from 'react';
import Pizzicato from 'pizzicato';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import BassKeyboard from './bass_keyboard';
import { useHotkeys, isHotkeyPressed } from 'react-hotkeys-hook';


function BassSynth() {

    //roughly 1.059
    const semitone_up = 261.63/246.94
    //roughly .943
    const semitone_down = 246.94/261.63
    //261 is middle c
    const c_freq = [65.41, 73.42, 82.41, 87.31, 98.00, 110.00, 123.47, 130.81, 146.83, 164.81]
    const default_tones = []  
   
    for (const element of c_freq) {
        default_tones.push(new Pizzicato.Sound({ 
            source: 'wave',
            options: { type: 'sine', frequency: element , release: 0.1, attack: 0.1, volume: .8}
        }))
    }
   
    const [tones, setTones] = useState(default_tones)
    const [frequencies, setFrequencies] = useState(c_freq)
    const [distortionOn, setdistortionOn] = useState(false)
    const [submitButtonVariant, setSubmitButtonVariant] = useState("outline-secondary")
    const [distButtonVariant, setDistButtonVariant] = useState("outline-secondary")
    const [keyFormDisabled, setKeyFormDisabled] = useState(false)
   // const [formChange, setFormChange] = useState(false)
    const [key, setKey] = useState("c")
  

    const multipliers = {
        "c": 1,
        "c_sharp": semitone_up,
        "d": Math.pow(semitone_up, 2),
        "e_flat": Math.pow(semitone_up, 3),
        "e": Math.pow(semitone_up, 4),
        "f": Math.pow(semitone_up, 5),
        "f_sharp": Math.pow(semitone_up, 6),
        "g": Math.pow(semitone_up, 7),
        "b": semitone_down,
        "b_flat": Math.pow(semitone_down, 2),
        "a": Math.pow(semitone_down, 3),
        "a_flat": Math.pow(semitone_down, 4),
    }

    const dropdownValues = [
        {'label': 'C Major', 'value': 'c' },
        {'label': 'C# Major', 'value': 'c_sharp' },
        {'label': 'D Major', 'value': 'd' },
        {'label': 'Eb Major', 'value': 'e_flat' },
        {'label': 'E Major', 'value': 'e' },
        {'label': 'F Major', 'value': 'f' },
        {'label': 'F# Major', 'value': 'f_sharp' },
        {'label': 'G Major', 'value': 'g' },
        {'label': 'B Major', 'value': 'b' },
        {'label': 'Bb Major', 'value': 'b_flat' },
        {'label': 'A Major', 'value': 'a' },
        {'label': 'Ab Major', 'value': 'a_flat' }
    ]

    var distortion = new Pizzicato.Effects.Distortion({
    gain: 0.4
    });

   

    function toggleDistortion() {
        for (const tone of tones) {
            tone.stop()
        }
        var isOn = distortionOn
        if (!distortionOn) {
            const notes = createWaves(frequencies, true)
            setTones(notes)
            setDistButtonVariant("secondary")
            isOn = true
        }
        else {
            const notes = createWaves(frequencies, false)
            setTones(notes)
            setDistButtonVariant("outline-secondary")
            isOn = false
        }
        setdistortionOn(isOn)
        
    }


    function createWaves(scale, distortionBool) {
        var tones = []  
        if (distortionBool) {
            for (var element of scale) {
                element = Math.round(element * 100) / 100
                tones.push(new Pizzicato.Sound({ 
                    source: 'wave',
                    options: { type: 'sine', frequency: element , release: 0.1, attack: 0.1, volume: .1}
                }))
            }
            for (const tone of tones) {
                tone.addEffect(distortion) 
            }
        }
        else {
            for (const element of scale) {
                tones.push(new Pizzicato.Sound({ 
                    source: 'wave',
                    options: { type: 'sine', frequency: element , release: 0.1, attack: 0.1, volume: .8}
                }))
            }
        }
        return tones
    }

    function handleKeyChange(e) {
        for (const tone of tones) {
            tone.stop()
        }
        setKey(e.target.value)
        setKeyFormDisabled(true)
        setSubmitButtonVariant('info')
       // setFormChange(true)
    }

    function handleKeySubmit(e) {
        for (const tone of tones) {
            tone.stop()
        }
        setScaleFreq(e)
        setKeyFormDisabled(false)
        setSubmitButtonVariant('outline-secondary')
        //setFormChange(false)
    }

    function setScaleFreq(e) {
        const key = e.target.value
        const frequencies = c_freq.map((element) => element * multipliers[key])
        setFrequencies(frequencies)
        const notes = createWaves(frequencies, distortionOn)
        setTones(notes)
    }

    
  
    return (
        <div>
             
           
        
            <Form.Select onChange={e => handleKeyChange(e)} disabled={keyFormDisabled}  style={{height:'3rem'}} >
                    <option value="" hidden> Change Key </option>
                   {dropdownValues.map((item) => <option key = {item.label} value={item.value}>{item.label}</option>)}
            </Form.Select>
            <Button variant={submitButtonVariant} size= "lg" value={key} onClick={e => handleKeySubmit(e)}>update key</Button>
            <Button variant={distButtonVariant} size= "lg" onClick={toggleDistortion} >toggle distortion</Button>
            <BassKeyboard tones={tones}/>
        </div>
    )
 
}
export default BassSynth