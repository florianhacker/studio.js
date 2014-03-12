FH.SoundFilter = function( filterType, cutOffFrequency ){

	this.filter = CONTEXT.createBiquadFilter();
	this.filterType = filterType;
	this.cutOffFrequency = cutOffFrequency;

	// extend Gain
	FH.GainNode.call( this, this.filter );
};

FH.SoundFilter.constructor = FH.SoundFilter;
FH.SoundFilter.prototype = Object.create( FH.GainNode.prototype );

FH.SoundFilter.prototype.init = function(){	

	this.filter.filterType = this.filterType  || 0;
	this.filter.frequency.value = this.cutOffFrequency || 300;

	this.filter.connect(this.gainNode);
};

Object.defineProperty(FH.SoundFilter.prototype, 'cutOffFrequency', {
    
    get: function() {
        return this.filter.frequency.value;
    },
    set: function(value) {
        this.filter.frequency.value = value;
    }
});