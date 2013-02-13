audio.DrumMachine = function()
{	
	playing = false;
	
	function DrumMachine(context, config, sounds)
	{	
		this.init(context, config, sounds);
	}
	
	
	DrumMachine.prototype.init = function(context, config, sounds)
	{	
		var soundMatrix = [];
		
		var idx = 0;
		for(var i = 0; i<config.segments.length; i++){
			soundMatrix[i] = [];
			for(var j = 0; j<config.segments[i]; j++){
				soundMatrix[i].push( sounds[idx] );
				idx++;
			}
		}
						
		this.context = context;
		this.soundMatrix = soundMatrix;
		this.bpm = 85;
		this.drumIndex = 15;
		this.selectedChannel = 0; 
		this.exactBeatTime = 0;

		this.sequence = config.sequence;
		this.selectedSamples = config.activeSamples;

		// cache views
		this.$view = $('#drummachine');
		this.$channels = $('.channel', this.$view);
		this.bpm = $('#bpm').val();
		this.$beats = $('.beat', this.$view);
		this.mixer = new audio.Mixer( this.context, 7);		
		
		
		for(var i = 0; i<config.sequence.length; i++){			
			var pattern = config.sequence[i];
			for(var j=0; j<pattern.length; j++){
				if(pattern[j] == 1)
					$(".sequence .beat", this.$channels.eq(i) ).eq(j).addClass("on")
			}
		}
		
		// EVENTS
		this.addEventListeners();
				
		// pseudo user click
		$('input.volume', this.view).trigger('change');		

	}	
	
	DrumMachine.prototype.play = function()
	{
		this.startTime = this.context.currentTime;
		this.exactBeatTime = 0;
		this.schedule();
		playing = true;
	}
	
	DrumMachine.prototype.stop = function()
	{
		clearInterval( this.interval );
		this.drumIndex = 15;
		
		//$(".beat.playing").removeClass("playing");
		$(".indicator").removeClass("on");
				
		
		
		playing = false;
	}
	
	DrumMachine.prototype.advancedNote = function()
	{
		var secondsPerBeat = 60.0 / this.bpm; //80 bpm
		//this.exactBeatTime += secondsPerBeat;
	
		this.exactBeatTime += 0.25 * secondsPerBeat; // WHY a quarter?
	
		this.drumIndex++;
		if( this.drumIndex == 16 ) this.drumIndex = 0;
	}
	
	
	DrumMachine.prototype.schedule = function()
	{	
		var loopTime = this.context.currentTime - this.startTime;
		while (this.exactBeatTime < loopTime ) {			
			this.advancedNote();
			
			for( var i=0; i<this.sequence.length; i++)
			{
				
				if( this.sequence[i][this.drumIndex] == 1 )
				{
					var bufferSource = this.context.createBufferSource();
					
					bufferSource.buffer = this.soundMatrix[i][ this.selectedSamples[i] ];
					bufferSource.connect( this.mixer.channels[i] );
					bufferSource.noteOn( this.exactBeatTime );
				}
				
				
				//$(".beat", this.$channels[i]).eq( this.drumIndex-1 ).removeClass("playing");
				//$(".beat", this.$channels[i]).eq( this.drumIndex ).addClass("playing");

				$(".indicator").eq( this.drumIndex-1 ).removeClass("on");
				$(".indicator").eq( this.drumIndex ).addClass("on");

			}

		}		
	
		var _this = this;
		this.interval = setTimeout(function(){_this.schedule()}, 0);
	}
	
		
	DrumMachine.prototype.addEventListeners = function()
	{
		var _this = this;
		
		/* 
			Click on beat, modify pattern
		*/
		this.$beats.click(function(event)
		{
			var idx = $(event.target).index();
			var $target = $(event.target);			
			var channelIdx = $target.parent().attr("data-index");
				
			if( $target.hasClass('on') )
			{
				$target.removeClass('on');
				_this.sequence[ channelIdx-1 ][idx] = 0;
			}
			else
			{
				$target.addClass('on');
				_this.sequence[ channelIdx-1 ][idx] = 1;
			}			
			
		});
		
		
		$('input.volume', this.view).change(function(event){

			if($(event.target).hasClass("master")){
				_this.mixer.masterVolume(event.target.value);	
			}
			else{
				//console.log("channel")
				var idx = $(event.target).parents(".channel").index();
				var vol = parseInt((event.target.value*100))/100;	
				_this.mixer.changeVolume(idx, vol);
				config.volume[idx] = vol;
				//console.log(config.volume)
			}
			

		});
	
		
		$('.sampleselect select', this.view).change(function(event){
			var idx = $(event.target).parents(".channel").index();
			var val = event.target.value;
			_this.selectedSamples[idx] = val;
		})
		
		$('#bpm', this.view).click(changeBPM);
		$('#bpm', this.view).change(changeBPM);
		
		function changeBPM(event){
			var bpm = $(event.target).val();
			_this.bpm = bpm ;
		}
		
		
		
	}
	
	DrumMachine.prototype.connectIO = function(input, output)
	{
		// no output
		console.log("connect Drummachine to: ", output)
		this.mixer.connectIO(null, output)
	}
		
		
	return DrumMachine;
	
}();