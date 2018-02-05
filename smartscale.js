/*
Smart Scale

MIT License

Copyright (c) 2018 Eliot Walker

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
This script takes a value from a linear range and scales it to a series
of output ranges.

To define these output ranges, the script requires a list in the format:

    [in_1, out_1, in_2, out_2, in_n, out_n]

where each input value is larger than the one preceding it. The output
values can be any floating point value.

Essentially, the script takes in a value. It scales this value from the
range defined by the two input values it falls between to the range
defined by the two output values associated with them.

In reality, it returns the value, the two input values and the two
output values and these can be fed into the [scale] object in Max.
*/

var output_map = {};

// declare inlets

inlets = 2;

var value_inlet = 0;
var list_inlet = 1;

setinletassist(value_inlet, "Value to scale");
setinletassist(list_inlet, "Scale format list");

// declare outlets

outlets = 5;

var value_outlet = 0;
var low_input_outlet = 1;
var high_input_outlet = 2;
var low_output_outlet = 3;
var high_output_outlet = 4;

setoutletassist(value_outlet, "The value to scale");
setoutletassist(low_input_outlet, "The bottom of the current input range");
setoutletassist(high_input_outlet, "The top of the current input range");
setoutletassist(low_output_outlet, "The bottom of the current output range");
setoutletassist(high_output_outlet, "The top of the current output range");


/*
    Generate output map

Take in a list of the format:
    [in_1, out_1, in_2, out_2, in_n, out_n]

and convert it to a dictionary in the format:
    {in_1: out_1, in_2: out_2, in_n: out_n}
*/
function list() {
    var args = arguments;

    // reset output_map
    output_map = {};

    for (var i = 0; i < arguments.length; i += 2)
    {
        var input_value = arguments[i];
        var output_value = arguments[i+1];
        output_map[input_value] = output_value;
    }
}

// scale the value according to the values in output_map
function msg_float(a)
{
    if (Object.keys(output_map).length > 0)
    {
        var last_input_value = output_map[0];
        for(var input_value in output_map)
        {
            if (input_value <= a)
            {
                last_input_value = input_value;
            }

            /*
            If input_value > a, then it is the top of our input
            range and last_input_value must be the bottom of our
            current input range.

            The output values associated with these two values
            must therefore define the current output range.
            */
            else if (input_value > a)
            {
                outlet(low_input_outlet, parseFloat(last_input_value));
                outlet(high_input_outlet, parseFloat(input_value));
                outlet(low_output_outlet, output_map[last_input_value]);
                outlet(high_output_outlet, output_map[input_value]);
                outlet(value_outlet, a);
                break;
            }
        }
    }
}