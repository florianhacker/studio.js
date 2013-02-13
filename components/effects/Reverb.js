audio.Reverb = function (context, output)
{	
	this.init(context, output);		
}

audio.Reverb.prototype = new audio.Convolution();


audio.Reverb.prototype.init = function(context, output)
{	
	audio.Convolution.prototype.init.call(this, context, output);
	
	var soundURLs =    ["audio/impulse-responses/matrix-reverb1.wav",
						"audio/impulse-responses/spatialized1.wav",
						"audio/impulse-responses/wildecho-old.wav",
						"audio/impulse-responses/backslap1.wav"];	
	
					
	this.loadedBuffers = null;	
	var _this = this;
	
	this.bufferLoader = new audio.BufferLoader( context, soundURLs, function(loadedBuffers){				
		_this.loadedBuffers = loadedBuffers;
		_this.setImpulseResponse(2);
	} );
	
	this.bufferLoader.load();
}

audio.Reverb.prototype.setImpulseResponse = function(index){
	this.convolver.buffer = this.loadedBuffers[index];
}