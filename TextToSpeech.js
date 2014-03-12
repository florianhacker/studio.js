FH.TextToSpeech = (function(){

	function TextToSpeech(){

		this.audio = null;
		this.baseUrl = "http://translate.google.com/translate_tts?tl=en&q=";

		this.init();
	}

	TextToSpeech.prototype.init = function(){	

		this.audio = new Audio();
	};

	TextToSpeech.prototype.speak = function(whatToSpeak){	
		
		this.audio.src = this.baseUrl + whatToSpeak;
		this.audio.play();
	};

	return TextToSpeech;

})();