/*
Max Co-Primes Generator

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

function coprimes(lo, hi, step, seed) {
	// a list to contain our coprime values
	var values = [];
	
	// loop over the range of values we want
	for (var i = lo; i <= hi; i += step)
	{
		// if we have found no coprimes...
		if (values.length == 0)
		{
			// ...we want to test if the value is coprime with our seed
			if (i % seed != 0)
			{
				values.push(i);
			}
		}
		// if we have found some coprimes...
		else
		{
			var coprime = true;
			
			// ...we want to test it against all our other coprime values
			for (var j = 0; coprime && j < values.length; j++)
			{
				if (i % values[j] == 0)
				{
					coprime = false;
				}
			}
			
			if (coprime)
			{
				values.push(i);
			}
			post(i % values[j]);
			post("\n");
		}
	}
	
	return values;
}

// inlets and outlets
inlets = 1;
outlets = 1;

setinletassist(0, "List [min, max, step, seed]");
setoutletassist(0, "List of coprimes");

function list() {
	var args = arguments;
	var lo = args[0];
	var hi = args[1];
	var step = args[2];
	var seed = args[3];
	
	if (hi > lo && step > 0 && seed > 1)
	{
		outlet(0, coprimes(args[0], args[1], args[2], args[3]));
	}
}