var audio = {};

audio.Studio = function()
{
	var loadedSounds = 0;
	var soundBuffer = [];
	
	function Studio()
	{
		this.init();
	}
	
	
	Studio.prototype.init = function()
	{			
		try
		{
		    this.context = new webkitAudioContext();
		}
		catch(e)
		{
		   	alert('Web Audio API is not supported in this browser');
		}

		this.installMixer();
	}	
	
	
	/**
		Load Sound into Soundbuffers forwhatever further use
	*/
	Studio.prototype.loadSounds = function( urls, callBack )
	{	
		this.loadBuffers(urls, function(buffers){

			for(var i = 0; i<buffers.length; i++){
				var bufferSource = this.context.createBufferSource();
				bufferSource.buffer = buffers[0];
				buffers[i] = bufferSource;
			}
			
			callBack(buffers);
		})
	}
	
	/**
		Load Sound into Soundbuffers forwhatever further use
	*/
	Studio.prototype.loadBuffers = function( urls, callBack )
	{	
		var bufferLoader = new audio.BufferLoader( this.context, urls, callBack );
		bufferLoader.load();
	}
	
	
	/**
		Install a basic mixer to connect any further devices
	*/
	Studio.prototype.installMixer = function()
	{
		this.studioMixer = new audio.Mixer( this.context );
		this.studioMixer.connectIO(null, this.context.destination); 
	}
	
	/**
		CONVOLUTION
	*/
	Studio.prototype.installEffectMachine = function( effectName )
	{
		var effect = null;
		
		switch( effectName )
		{
			case "reverb":
				effect = new audio.Reverb( this.context );
				break;
			
			case "whateverthatwillbe":
				break;
			
			default:
				console.log("installEffectMachine, effect could not be found: " + effect);
				break;
		}
		
		return effect;
	}
	
	
	/**
		Create a Drummachine
	*/
	Studio.prototype.installDrumMachine = function( urls, config, callBack )
	{		
		this.loadBuffers( urls, onLoadComplete );
		
		var _this = this;
		_this.onDrumMachineLoaded = callBack;
		
		function onLoadComplete( sounds ){	
			//config.sounds = sounds;
			studio.drumMachine = new audio.DrumMachine( _this.context, config, sounds );
			studio.onDrumMachineLoaded();
		}
		
		return studio.drumMachine;
	}
	
	Studio.prototype.installFilter = function(type)
	{
		return new audio.Filter( this.context, type );
	}
	
	Studio.prototype.installCompressor = function(){
	//	return this.context.createDynamicsCompressor();
		return this.context.createDynamicsCompressor();	
	}
	
		
	return Studio;
	
}();