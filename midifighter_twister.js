/*
Midi Fighter Twister Max Control

MIT License

Copyright (c) 2017 Eliot Walker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/*
This script takes from ctlin:
- the value
- the controller number
- the channel number 

This script returns:
- a list of the values from the Twister
- the number of active knobs (i.e. knobs with a value over 0)
- a list of the buttons' toggled on/off states
- the number of active toggles
- a list of the currently pressed buttons
- the number of currently pressed buttons
*/

// the number of knobs (on all four banks) of a Midi Fighter Twister

var num_knobs = 64;

// declare inlets

inlets = 3;

var value_inlet = 0;
var controller_inlet = 1;
var channel_inlet = 2;

setinletassist(value_inlet, "MIDI value(0-127)");
setinletassist(controller_inlet, "Controller number (0-63)");
setinletassist(channel_inlet, "Channel number (1 / 2).");

// initialise inlets

var value = 0;
var controller = 0;
var channel = 0;

// declare outlets

outlets = 6;

var values_outlet = 0;
var active_knobs_outlet = 1;
var toggles_outlet = 2;
var active_toggles_outlet = 3;
var buttons_outlet = 4;
var active_buttons_outlet = 5;

setoutletassist(values_outlet, "List of values (index = controller).");
setoutletassist(active_knobs_outlet, "The number of active knobs (i.e. knobs with a value over 0).");
setoutletassist(toggles_outlet, "List of button toggled on / off states (0 = off, 1 = on) (index = controller).");
setoutletassist(active_toggles_outlet, "The number of active toggles.");
setoutletassist(buttons_outlet, "List of buttons non-toggled on /off states (0 = off, 1 = on) (index = controller).");
setoutletassist(active_buttons_outlet, "The number of active buttons.");

// initialise outlets

// will contain the knob values of all the knobs
var values = [];
for (var i = 0; i < num_knobs; ++i) values[i] = 0; // init to 0

// will contain the toggled on / off state of all the buttons
var toggles = [];
for (var i = 0; i < num_knobs; ++i) toggles[i] = 0; // init to 0

// will contain the non-toggled on / off state of all the buttons
var buttons = [];
for (var i = 0; i < num_knobs; ++i) buttons[i] = 0; // init to 0

// active counters
var active_knobs = 0;
var active_toggles = 0;
var active_buttons = 0;

// will contain the buttons that are currently pressed down.
// 0 = not pressed down
// 1 = pressed down, moving to toggled off state
// 2 = pressed down, moving to toggled on state
var buttons_half_pressed = [];
for (var i = 0; i < num_knobs; ++i) buttons_half_pressed[i] = 0; // init to 0

var not_pressed = 0;
var pressed_off = 1;
var pressed_on = 2;

// set Midi Fighter Twister channels

var knob_channel = 1;
var button_channel = 2;
var side_channel = 4;

function msg_int(a)
{
    if (inlet == channel_inlet)
    {
        channel = a;
    }

    else if (inlet == controller_inlet)
    {
        controller = a;
    }

    else if (inlet == value_inlet)
    {
        // if we are turning a knob
        if (channel == knob_channel)
        {
            // store the current value to work out the number
            // of active knobs later on.
            var original_value = values[controller];

            // set the knob value to a and send the modified list
            values[controller] = a;

			outlet(values_outlet, values);

            // change the number of active knobs

            // if we've gone from off to on
            if (a > 0 && original_value == 0)
            {
                // increment the number of active knobs
                active_knobs += 1;
            }

            // if we've gone from on to off
            else if (a == 0 && original_value > 0)
            {
                // decrement the number of active knobs
                active_knobs -= 1;
            }

            outlet(active_knobs_outlet, active_knobs);
        }

        // if we are pressing a button
        else if (channel = button_channel)
        {
            // first, modify the buttons array

            // if the button is turned off
            if (buttons[controller] == 0)
            {
                // turn the button on
                buttons[controller] = 1;
                active_buttons += 1;
            }

            // if the button is turned on
            else if (buttons[controller] == 1)
            {
                // turn the button off
                buttons[controller] = 0;
                active_buttons -= 1;
            }

            outlet(buttons_outlet, buttons);
            outlet(active_buttons_outlet, active_buttons);

            // next, modify the toggles array

            // not pressed && toggles off -> pressed_on, toggles on
            // not pressed && toggles on -> pressed_off, toggles off
            // pressed_on -> not_pressed, toggles on
            // pressed_off -> not_pressed, toggles off

            // if the button was not already pressed and the toggle was turned off
            if (buttons_half_pressed[controller] == not_pressed && toggles[controller] == 0)
            {
                // the button has been pressed on
                buttons_half_pressed[controller] = pressed_on;

                // the toggle is turned on
                toggles[controller] = 1;
                active_toggles += 1;
            }
            // if the button was not already pressed and the toggle was turned on
            else if  (buttons_half_pressed[controller] == not_pressed && toggles[controller] == 1)
            {
                // the button has been pressed off
                buttons_half_pressed[controller] = pressed_off;

                // the toggle is turned off
                toggles[controller] = 0;
                active_toggles -= 1;
            }
            // if the button was pressed on
            else if (buttons_half_pressed[controller] == pressed_on)
            {
                // the button is not pressed
                buttons_half_pressed[controller] = not_pressed;
            }
            // if the button was pressed off
            else if (buttons_half_pressed[controller] == pressed_off)
            {
                // the button is not pressed
                buttons_half_pressed[controller] = not_pressed;
            }

            outlet(toggles_outlet, toggles);
            outlet(active_toggles_outlet, active_toggles);
        }

    }
}