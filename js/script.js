function init(){

    gyro.frequency = 100;

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
				var tiltUp = new Event('tilt-up');
				$('#left_image')[0].contentWindow.document.dispatchEvent(tiltUp);
				$('#right_image')[0].contentWindow.document.dispatchEvent(tiltUp);
				

			}else if(o.gamma > -75 && o.gamma < 0){
				//tilting down in landscape
				var tiltDown = new Event('tilt-down');
				$('#left_image')[0].contentWindow.document.dispatchEvent(tiltDown);
				$('#right_image')[0].contentWindow.document.dispatchEvent(tiltDown);
				
			}else{
				var noTilt = new Event('no-vertical-tilt');
				$('#left_image')[0].contentWindow.document.dispatchEvent(noTilt);
				$('#right_image')[0].contentWindow.document.dispatchEvent(noTilt);
			}

			if(o.beta > 3){
				//tilting up in landscape
				var tiltLeft = new Event('tilt-left');
				$('#left_image')[0].contentWindow.document.dispatchEvent(tiltLeft);
				$('#right_image')[0].contentWindow.document.dispatchEvent(tiltLeft);
				

			}else if(o.beta < -3){
				//tilting down in landscape
				var tiltRight = new Event('tilt-right');
				$('#left_image')[0].contentWindow.document.dispatchEvent(tiltRight);
				$('#right_image')[0].contentWindow.document.dispatchEvent(tiltRight);
				
			}else{
				var noTilt = new Event('no-horizontal-tilt');
				$('#left_image')[0].contentWindow.document.dispatchEvent(noTilt);
				$('#right_image')[0].contentWindow.document.dispatchEvent(noTilt);
			}

	    });
	}

	var hammerTime = new Hammer(document);
	hammerTime.on('tap', function(e){
		e.preventDefault();
		var tap = new Event('tap');
		$('#left_image')[0].contentWindow.document.dispatchEvent(tap);
		$('#right_image')[0].contentWindow.document.dispatchEvent(tap);
	});

$(init());

