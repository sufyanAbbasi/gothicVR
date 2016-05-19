var tileEnum = {
    TOP_LEFT      : 0,
    TOP_MIDDLE    : 1,
    TOP_RIGHT     : 2,
    MIDDLE_LEFT   : 3,
    CENTER        : 4,
    MIDDLE_RIGHT  : 5,
    BOTTOM_LEFT   : 6,
    BOTTOM_MIDDLE : 7, 
    BOTTOM_RIGHT  : 8,

    TOP_ROW       : 0,
    MIDDLE_ROW    : 3,
    BOTTOM_ROW    : 6,

    LEFT_COLUMN   : 0,
    MIDDLE_COLUMN : 1,
    RIGHT_COLUMN  : 2,
}

var currentColumn = tileEnum.MIDDLE_COLUMN;
var currentRow = tileEnum.MIDDLE_ROW;


function dispatchToIframes(eventString, data){
	$('#left_image')[0].contentWindow.document.dispatchEvent(new CustomEvent(eventString, {"detail" : data}));
	$('#right_image')[0].contentWindow.document.dispatchEvent(new CustomEvent(eventString, {"detail" : data}));	
}


function keyEvent(event) {
  var key = event.keyCode || event.which;
  if (key >= 49 && key <= 57) {
    	$('#left_image')[0].contentWindow.panTo(key - 49);
		$('#right_image')[0].contentWindow.panTo(key - 49);
	}
}

function panToCenter(){
	currentColumn = tileEnum.MIDDLE_COLUMN;
	currentRow = tileEnum.MIDDLE_ROW;

	dispatchToIframes('pan-to', {"tile": currentRow + currentColumn});
}

function panToNext(){

	if(currentColumn == tileEnum.RIGHT_COLUMN){
		currentColumn = tileEnum.LEFT_COLUMN;
		if(currentRow == tileEnum.BOTTOM_ROW){
			currentRow = tileEnum.TOP_ROW;
		}else{
			currentRow += 3;
		}
	}else{
		currentColumn++;
	}

	dispatchToIframes('pan-to', {"tile": currentRow + currentColumn});
}

function init(){

	document.addEventListener("keypress", keyEvent, false);

	document.addEventListener("click", function(e){
		e.preventDefault();
		dispatchToIframes('zoom-in');
	}, false);

	document.addEventListener("dblclick", function(e){
		e.preventDefault();
		dispatchToIframes('zoom-out');
		dispatchToIframes('zoom-out');
	}, false);

	//get orientation info
	if (window.DeviceOrientationEvent) 
	{
	    window.addEventListener("deviceorientation", function (event) 
	    {	
			 switch (window.orientation) {  
			    case 0:  
			    
			        // Portrait 
			        break; 
			        
			    case 180:  
			    
			        // Portrait (Upside-down)
			        break; 
			  
			    case -90:  
			     	orientationScaler = orientationEnum.UP_NEGATIVE;
			        // Landscape (Clockwise)
			        break;  
			  
			    case 90:  
			    	orientationScaler = orientationEnum.UP_POSITIVE;
			        // Landscape  (Counterclockwise)
			        break;
			    }
				    }, true);
				} 

	//$('.values').html("Listening for events.");

	var hammer = new Hammer(document, {});

	var singleTap = hammer.get('tap');
	var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2, interval: 500 });
	var tripleTap = new Hammer.Tap({event: 'tripletap', taps: 3, interval: 500 });
	var press = hammer.get('press').set({time: 750});

	hammer.add([doubleTap, tripleTap]);

	tripleTap.recognizeWith([doubleTap, singleTap]);
	doubleTap.recognizeWith(singleTap);

	doubleTap.requireFailure(tripleTap);
	singleTap.requireFailure([tripleTap, doubleTap]);

	hammer.on('press', function(ev){
		$('.values').html("Press event fired.");
		setTimeout(function(){
			$('.values').html("");
		}, 150);
		//dispatchToIframes('zoom-in');
		//panToCenter();

	});

	hammer.on('tap', function(ev){
		$('.values').html("tap event fired.");
		setTimeout(function(){
			$('.values').html("");
		}, 150);
		//panToNext();
	});

	hammer.on('doubletap', function(ev){
		$('.values').html("double tap event fired.");
		setTimeout(function(){
			$('.values').html("");
		}, 150);
		//dispatchToIframes('zoom-out');
		//panToCenter();
	});
}

$(init());

