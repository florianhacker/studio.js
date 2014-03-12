FH.SoundAnalyzer = function( ){

	this.analyzer = CONTEXT.createAnalyser();
	this.analyzer.smoothingTimeConstant = 0.6;
	this.analyzer.fftSize = 512;

	FH.GainNode.call( this, this.analyzer );
};

FH.SoundAnalyzer.constructor = FH.SoundAnalyzer;
FH.SoundAnalyzer.prototype = Object.create( FH.GainNode.prototype );


FH.SoundAnalyzer.prototype.init = function(){
	
	this.fSpectrumArray = new Uint8Array( this.analyzer.frequencyBinCount );

	this.analyzer.connect(this.gainNode);
	this.analyze();
};

FH.SoundAnalyzer.prototype.analyze = function(channels){

	this.analyzer.getByteFrequencyData( this.fSpectrumArray );
	
	var channelSpectrum = this.splitSoundSpectrum( this.fSpectrumArray, 64 );
	var spectrum = this.getActiveFrequencies( this.fSpectrumArray );

	this.dispatchEvent( { type: 'sound-analayzed', soundSpectrum : channelSpectrum });

	requestAnimFrame( this.analyze.bind(this) );


	//return isNaN(channels) ? fSpectrumArray : this.splitSoundSpectrum( fSpectrumArray, channels );

};

FH.SoundAnalyzer.prototype.getActiveFrequencies = function( soundSpectrum ){
		
	var activeFrequencies = [];

	for(var i = 0; i < soundSpectrum.length; i++){

		if(soundSpectrum[i] > 0 ){
			activeFrequencies.push( soundSpectrum[i] );
		}
	}

	return activeFrequencies;

};

FH.SoundAnalyzer.prototype.splitSoundSpectrum = function( soundSpectrum, channels){
		
	var spectrumChannels = [];
	var maxFrequenciesPerChannel = soundSpectrum.length / channels;

	// per channel
	var frequencySum = 0;
	var frequencyCount = 0;

	for(var i = 0; i < soundSpectrum.length; i++){

		frequencySum += soundSpectrum[i];
		frequencyCount++;

		if( frequencyCount >= maxFrequenciesPerChannel ){
				
			var averageFrequency = Math.round( frequencySum/frequencyCount );

			spectrumChannels.push(averageFrequency);

			frequencySum = 0;
			frequencyCount = 0;
		}
	}

	return spectrumChannels;

};
