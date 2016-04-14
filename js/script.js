function dispatchToIframes(eventString){
	$('#left_image')[0].contentWindow.document.dispatchEvent(new Event(eventString));
	$('#right_image')[0].contentWindow.document.dispatchEvent(new Event(eventString));	
}

function init(){

    gyro.frequency = 80;

	gyro.startTracking(function(o) {
	        // o.x, o.y, o.z for accelerometer
	        // o.alpha, o.beta, o.gamma for gyro

	        //gamma - while in landscape view:
	        //        flat with screen facing down is 0°, and rotating towards being flat to your face increases to 90° 
	        //        then becomes -89.999 --> -0 


	       $('.values').html("alpha: " + o.alpha + "<br>beta: " + o.beta + "<br>gamma: " + o.gamma);

	        //vertical tilt checkers

			if(o.gamma > 0 && o.gamma < 85){
				//tilting up in landscape
				dispatchToIframes('tilt-up');
				

			}else if(o.gamma > -75 && o.gamma < 0){
				//tilting down in landscape
				dispatchToIframes('tilt-down');
				
			}else{
				dispatchToIframes('no-vertical-tilt');
			}

			if(o.gamma < 0){

				if(o.beta > 2.5){
					//tilting up in landscape
					dispatchToIframes('tilt-left');
					

				}else if(o.beta < -2.5){
					//tilting down in landscape
					dispatchToIframes('tilt-right');
					
				}else{
					dispatchToIframes('no-horizontal-tilt');
				}
			}else{
				// if(o.beta < 0 && o.beta > -175){
				// 	//tilting up in landscape
				// 	dispatchToIframes('tilt-left');
					

				// }else if(o.beta > ){
				// 	//tilting down in landscape
				// 	dispatchToIframes('tilt-right');
					
				// }else{
				// 	dispatchToIframes('no-horizontal-tilt');
				// }
			}
	    });
	}

	//$('.values').html("Listening for events.");

	var eventListener = new Hammer(document);
	
	eventListener.get('press').set({
		time: 1000,
		threshold: 30,
	});

	eventListener.get('tap').set({
		threshold: 700,
	});

	eventListener.get('press').dropRecognizeWith(eventListener.get('tap'));

	eventListener.on('press', function(ev){
		//$('.values').html("Press event fired.");
		dispatchToIframes('zoom-start');

	});

	eventListener.on('pressup', function(ev){
		//$('.values').html("Pressup event fired.");
		// setTimeout(function(){
		// 	$('.values').html("Listening for events.");
		// }, 500);
		dispatchToIframes('zoom-end');
	});

	eventListener.on('tap', function(ev){
		// $('.values').html("Tap event fired");
		// setTimeout(function(){
		// 	$('.values').html("Listening for events.");
		// }, 500);

		dispatchToIframes('zoom-out');
	})

$(init());

