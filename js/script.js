function dispatchToIframes(eventString){
	$('#left_image')[0].contentWindow.document.dispatchEvent(new Event(eventString));
	$('#right_image')[0].contentWindow.document.dispatchEvent(new Event(eventString));	
}

var TILT_LIMIT = 30;



function init(){

	var promise = FULLTILT.getDeviceOrientation({'type': 'game'});

	promise.then(function(orientationControl) {
		//console.log(orientationControl);
		orientationControl.listen(function() {

			var euler;

			euler = orientationControl.getLastRawEventData();

			//euler = orientationControl.getScreenAdjustedEuler();

			// Don't update CSS position if we are close to encountering gimbal lock
			if (euler.beta > 85 && euler.beta < 95) {
				return;
			}

			var tiltX = euler.gamma;

			if (tiltX > 0) {
				tiltX = Math.min(tiltX, TILT_LIMIT);
			} else {
				tiltX = Math.max(tiltX, TILT_LIMIT * -1);
			}

			var pxOffsetX = (tiltX * halfScreenWidth) / TILT_LIMIT;

			if ( !initialBeta ) {
				initialBeta = euler.beta;
			}

			var tiltY = euler.beta - initialBeta;

			if (tiltY > 0) {
				tiltY = Math.min(tiltY, TILT_LIMIT);
			} else {
				tiltY = Math.max(tiltY, TILT_LIMIT * -1);
			}

			$('.values').html("tiltX: " + tiltX + "<br>tiltY: " + tiltY);

		});

	}, function(err){
		console.log(err);
	});

	
	//$('.values').html("Listening for events.");

	var eventListener = new Hammer(document);

	eventListener.get('tap').set({
		threshold: 700,
	});

	eventListener.get('doubletap').set({
		taps: 2,
		threshold: 700,
		interval: 500,
	});

	eventListener.get('doubletap').dropRecognizeWith(eventListener.get('tap'));

	eventListener.on('doubletap', function(ev){
		//$('.values').html("Press event fired.");
		dispatchToIframes('zoom-in');

	});

	eventListener.on('tap', function(ev){
		// $('.values').html("Tap event fired");
		// setTimeout(function(){
		// 	$('.values').html("Listening for events.");
		// }, 500);

		dispatchToIframes('zoom-out');
	})
}

$(init());

