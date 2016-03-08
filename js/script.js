
var leftImgArr = ["./stereo_images/Albi_074.png"];
var rightImgArr = ["./stereo_images/Albi_075.png"];

var getPointerEvent = function(event) {
	    return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
	};
	
var $touchArea = $('#touchArea'),
    touchStarted = false, // detect if a touch event is sarted
    currX = 0,
    currY = 0,
    cachedX = 0,
    cachedY = 0;
    gyroModeOn = false;

function gyroMode(){
	if(!gyroMode){

		//code to start gyro
		
		gyroMode = true;
	}else{
		//code to stop gyro

		gyroMode = false;
	}
}


function init(){

	$("#left_image").attr("src", leftImgArr[0]);
	$("#right_image").attr("src", rightImgArr[0]);

	gyro.frequency = 100;

	gyro.startTracking(function(o) {
	        // o.x, o.y, o.z for accelerometer
	        // o.alpha, o.beta, o.gamma for gyro


	        $('#values').html("x: " + o.x + "<br>y: " + o.y + "<br>z: " + o.z + 
	        	               "<br>alpa: " + o.alpha + "<br>beta: " + o.beta + "<br>gamma: " + o.gamma);




	    });

	//setting the events listeners
	$touchArea.on('touchstart mousedown',function (e){
	    e.preventDefault(); 
	    var pointer = getPointerEvent(e);
	    // caching the current x
	    cachedX = currX = pointer.pageX;
	    // caching the current y
	    cachedY = currY = pointer.pageY;
	    // a touch event is detected      
	    touchStarted = true;
	    // detecting if after 200ms the finger is still in the same position
	    setTimeout(function (){
	        if ((cachedX === currX) && !touchStarted && (cachedY === currY)) {
	            // Here you get the Tap event
	            gyroMode();
	        }
	    },200);

	});
	$touchArea.on('touchend mouseup touchcancel',function (e){
	    e.preventDefault();
	    // here we can consider finished the touch event
	    touchStarted = false;
	});

	$touchArea.on('touchmove mousemove',function (e){
	    e.preventDefault();
	    var pointer = getPointerEvent(e);
	    currX = pointer.pageX;
	    currY = pointer.pageY;
	    if(touchStarted) {
	         // here you are swiping
	    }
	   
	});
	}

$(init());

