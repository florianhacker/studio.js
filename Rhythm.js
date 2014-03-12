FH.Rhythm = function(cb, beatLength){

	this.init(cb, beatLength);
};

FH.Rhythm.prototype.init = function(cb, beatLength){
	
	this.callback = cb;
	this.beatLength = beatLength;
	this.interval = null;
	this.isRunning = false;
};

FH.Rhythm.prototype.start = function(){

	this.startTime = CONTEXT.currentTime;
	this.drumIndex = 0;
	this.exactBeatTime = 0;
	
	this.isRunning = true;
	
	this.schedule();
}

FH.Rhythm.prototype.stop = function(){

	clearInterval( this.interval );
	this.isRunning = false;
}

FH.Rhythm.prototype.schedule = function()
{	
	//console.log("schedule", CONTEXT, CONTEXT.currentTime );

	var loopTime = CONTEXT.currentTime - this.startTime;
	while (this.exactBeatTime < loopTime ) {			
		
		var idx = this.advancedNote();
	}		

	this.interval = setTimeout(this.schedule.bind(this), 0);
}


FH.Rhythm.prototype.advancedNote = function()
{
	var secondsPerBeat = 60.0 / 80;
	this.exactBeatTime += 0.25 * secondsPerBeat;

	var oldDrumIndex = this.drumIndex;

	if(this.drumIndex < this.beatLength-1)
	{
		this.drumIndex++;
	}
	else{
		this.drumIndex = 0	
	}

	this.callback(this.drumIndex, oldDrumIndex);
}

