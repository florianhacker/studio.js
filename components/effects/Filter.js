/*
const unsigned short LOWPASS = 0;
const unsigned short HIGHPASS = 1;
const unsigned short BANDPASS = 2;
const unsigned short LOWSHELF = 3;
const unsigned short HIGHSHELF = 4;
const unsigned short PEAKING = 5;
const unsigned short NOTCH = 6;
const unsigned short ALLPASS = 7;
*/

audio.Filter = function(context, type)
{
	this.init(context, type);
}

audio.Filter.prototype.init = function( context, type )
{		
	this.context = context;
	
	this.filter = this.context.createBiquadFilter();
	this.filter.type = type; // Low-pass filter. See BiquadFilterNode docs
//	this.setFrequency(440); // Set cutoff to 440 HZ
	
	this.inputGain = this.context.createGainNode();
	this.inputGain.connect(this.filter);
}

audio.Filter.prototype.connectIO = function(input, output)
{		
		this.filter.connect( output );
}

audio.Filter.prototype.setFrequency = function(value){
	this.filter.frequency.value = value; 
}

// for dynamic frequency changes from 0 to 1
audio.Filter.prototype.changeFrequency = function(value){
	// code from http://www.html5rocks.com/en/tutorials/webaudio/intro/js/filter-sample.js
	// Clamp the frequency between the minimum value (40 Hz) and half of the
	// sampling rate.
	var minValue = 40;
	var maxValue = this.context.sampleRate / 2;
	// Logarithm (base 2) to compute how many octaves fall in the range.
	var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
	// Compute a multiplier from 0 to 1 based on an exponential scale.
	var multiplier = Math.pow(2, numberOfOctaves * (value - 1.0));
	// Get back to the frequency value between min and max.
	this.filter.frequency.value = maxValue * multiplier; 
}

audio.Filter.prototype.setQuality = function(value) {
  this.filter.Q.value = value * 30;
};

audio.Filter.prototype.setGain = function(value) {
  this.filter.gain.value = value;
};
