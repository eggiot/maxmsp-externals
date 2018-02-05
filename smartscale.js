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

var output_map = [];

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
    Get output map
*/
function list() {
    output_map = arguments;
}

// scale the value according to the values in output_map
function msg_float(a)
{
    if (output_map.length > 0)
    {
        // if we're at the end or past the last input range
        if(a >= end_index(output_map, 1))
        {
            outlet(low_input_outlet, end_index(output_map, 3));
            outlet(high_input_outlet, end_index(output_map, 1));
            outlet(low_output_outlet, end_index(output_map, 2));
            outlet(high_output_outlet, end_index(output_map, 0));
            outlet(value_outlet, a);             
        }

        // if we're at the beginning or below the first input range
        else if(a <= output_map[0])
        {
            outlet(low_input_outlet, output_map[0]);
            outlet(high_input_outlet, output_map[2]);
            outlet(low_output_outlet, output_map[1]);
            outlet(high_output_outlet, output_map[3]);
            outlet(value_outlet, a);             
        }

        // if we're within the input range
        else
        {
            for(var i = 0; i < output_map.length; i += 2)
            {
                /*
                If the current input value > a, then it is the top of
                our input range and the input value below it must be
                the bottom of our current input range.

                The output values associated with these two values
                must therefore define the current output range.
                */
                if(output_map[i] > a)
                {
                    outlet(low_input_outlet, output_map[i-2]);
                    outlet(high_input_outlet, output_map[i]);
                    outlet(low_output_outlet, output_map[i-1]);
                    outlet(high_output_outlet, output_map[i+1]);
                    outlet(value_outlet, a);
                    break;
                }
            }
        }
    }
}

// index array from the end - 0 indexed
function end_index(a, index) {return a[a.length - (index + 1)];}