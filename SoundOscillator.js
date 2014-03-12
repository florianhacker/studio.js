FH.SoundOscillator = function( type, frequency ){
	
	this.oscillator = CONTEXT.createOscillator();

	this.type = type;
	this.frequency = frequency;

	// extend Gain
	FH.GainNode.call( this, this.oscillator );
};

FH.SoundOscillator.constructor = FH.SoundOscillator;
FH.SoundOscillator.prototype = Object.create( FH.GainNode.prototype );

FH.SoundOscillator.prototype.init = function(){	

	this.oscillator.type = this.type;
	this.oscillator.frequency.value = this.frequency; 

	this.oscillator.connect(this.gainNode); 
};

FH.SoundOscillator.prototype.play = function(){

	this.oscillator.noteOn(0); 
};

Object.defineProperty(FH.SoundOscillator.prototype, 'frequency', {
    
    get: function() {
        return this.oscillator.frequency.value;
    },
    set: function(value) {
        this.oscillator.frequency.value = value;
    }
});

Object.defineProperty(FH.SoundOscillator.prototype, 'waveform', {
    
    get: function() {
        return this.oscillator.type;
    },
    set: function(value) {
        this.oscillator.type = value;
    }
});