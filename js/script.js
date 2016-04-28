var verticalLimits = 70;

var gyro=quatFromAxisAngle(0,0,0,0);

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

function computeQuaternionFromEulers(alpha,beta,gamma)
{
	var x = degToRad(beta) ; // beta value
	var y = degToRad(gamma) ; // gamma value
	var z = degToRad(alpha) ; // alpha value

	//precompute to save on processing time
	var cX = Math.cos( x/2 );
	var cY = Math.cos( y/2 );
	var cZ = Math.cos( z/2 );
	var sX = Math.sin( x/2 );
	var sY = Math.sin( y/2 );
	var sZ = Math.sin( z/2 );

	var w = cX * cY * cZ - sX * sY * sZ;
	var x = sX * cY * cZ - cX * sY * sZ;
	var y = cX * sY * cZ + sX * cY * sZ;
	var z = cX * cY * sZ + sX * sY * cZ;

	return makeQuat(x,y,z,w);	  
}

function makeQuat(x,y,z,w)//simple utility to make quaternion object
{
	return  {"x":x,"y":y,"z":z,"w":w};
}

function degToRad(deg)// Degree-to-Radian conversion
{
     return deg * Math.PI / 180; 
}

function quatFromAxisAngle(x,y,z,angle)
{
  var q={};
  var half_angle = angle/2;
  q.x = x * Math.sin(half_angle);
  q.y = y * Math.sin(half_angle);
  q.z = z * Math.sin(half_angle);
  q.w = Math.cos(half_angle);
  return q;
}


function dispatchToIframes(eventString, data){
	$('#left_image')[0].contentWindow.document.dispatchEvent(new CustomEvent(eventString, {"detail" : data}));
	$('#right_image')[0].contentWindow.document.dispatchEvent(new CustomEvent(eventString, {"detail" : data}));	
}


//Alpha around Z axis, beta around X axis and gamma around Y axis intrinsic local space  

function processGyro(alpha,beta,gamma)
	{

		if(gamma < verticalLimits && gamma > 0){
			dispatchToIframes('tilt-up');
			// $('.values').html("Tilting Up");
		}else if(gamma > -verticalLimits && gamma < 0){
			dispatchToIframes('tilit-down');
			// $('.values').html("Tilting Down");
		}else{
			dispatchToIframes('no-vertical-tilt');
			// $('.values').html("No Vertical Tilt");
		}
	}

function keyEvent(event) {
  var key = event.keyCode || event.which;
  if (key >= 49 && key <= 57) {
    	$('#left_image')[0].contentWindow.panTo(key - 49);
		$('#right_image')[0].contentWindow.panTo(key - 49);
	}
}

function init(){

	var gn = new GyroNorm();

	var args = {
		    frequency: 100,                   // ( How often the object sends the values - milliseconds )
		    gravityNormalized:true,         // ( If the garvity related values to be normalized )
		    orientationBase: GyroNorm.GAME,      // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
		    decimalCount:5,                 // ( How many digits after the decimal point will there be in the return values )
		    logger:null,                    // ( Function to be called to log messages from gyronorm.js )
		    screenAdjusted:true,            // ( If set to true it will return screen adjusted values. )
		};

	 gn.init(args).then(function(){
        gn.start(function(data){
            // Process:
            // data.do.alpha    ( deviceorientation event alpha value )
            // data.do.beta     ( deviceorientation event beta value )
            // data.do.gamma    ( deviceorientation event gamma value )
            // data.do.absolute ( deviceorientation event absolute value )

            // data.dm.x        ( devicemotion event acceleration x value )
            // data.dm.y        ( devicemotion event acceleration y value )
            // data.dm.z        ( devicemotion event acceleration z value )

            // data.dm.gx       ( devicemotion event accelerationIncludingGravity x value )
            // data.dm.gy       ( devicemotion event accelerationIncludingGravity y value )
            // data.dm.gz       ( devicemotion event accelerationIncludingGravity z value )

            // data.dm.alpha    ( devicemotion event rotationRate alpha value )
            // data.dm.beta     ( devicemotion event rotationRate beta value )
            // data.dm.gamma    ( devicemotion event rotationRate gamma value )

            $('.values').html("x: " + data.dm.x  + "<br>y: " + data.dm.y  + "<br>z: " + data.dm.z +
						  "<br>alpa: " + data.do.alpha + "<br>beta: " + data.do.beta + "<br>gamma: " + data.do.gamma
			);

			processGyro(data.do.alpha, data.do.beta, data.do.gamma);

        });
    }).catch(function(e){
      // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
    });

	document.addEventListener("keypress", keyEvent, false);

	document.addEventListener("click", function(){
		dispatchToIframes('zoom-in');
	}, false);

	document.addEventListener("dblclick", function(){
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

	eventListener.on('tap', function(ev){
		//$('.values').html("Press event fired.");
		dispatchToIframes('zoom-in');

	});

	eventListener.on('doubletap', function(ev){
		dispatchToIframes('zoom-out');
	});
}

$(init());

