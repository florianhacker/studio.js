FH.GainNode = function(input){

	this.input = input;
	this.gainNode = CONTEXT.createGain();
	this.init();
};

FH.GainNode.prototype.init = function(){
	
};

/**
	always use Gain node to connect any source
*/
FH.GainNode.prototype.connect = function(destination){

	this.gainNode.connect(destination);
};

Object.defineProperty(FH.GainNode.prototype, 'volume', {
    
    get: function() {
        return this.gainNode.gain;
    },
    set: function(value) {
        this.gainNode.gain = value;
    }
});

EventDispatcher.prototype.apply( FH.GainNode.prototype );