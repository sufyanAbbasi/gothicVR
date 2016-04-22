function dispatchToIframes(eventString){
	$('#left_image')[0].contentWindow.document.dispatchEvent(new Event(eventString));
	$('#right_image')[0].contentWindow.document.dispatchEvent(new Event(eventString));	
}

var TILT_LIMIT = 30;

//var gyro=quatFromAxisAngle(0,0,0,0);

//Alpha around Z axis, beta around X axis and gamma around Y axis intrinsic local space  


/** If homebutton is on the left:
 * Top Left: 
 * Top Middle:
 * Top Right: 
 * Middle Left:
 * Center: 
 * Bottom Left:
 * Bottom Middle:
 * Bottom Right:
 */





   
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

function makeQuat(x,y,z,w)//simple utitlity to make quaternion object
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

function processGyro(alpha,beta,gamma)
	{
		gyro=computeQuaternionFromEulers(alpha,beta,gamma);
		$('.values').html("x: " + gyro.x.toFixed(5) + "<br>y: " + gyro.y.toFixed(5) + "<br>z: " + gyro.z.toFixed(5) + "<br>w: " + gyro.w.toFixed(5) + 
						  "<br>alpa: " + alpha.toFixed(5) + "<br>beta: " + beta.toFixed(5) + "<br>gamma: " + gamma.toFixed(5)
		);
	}


function init(){
	//get orientation info
	if (window.DeviceOrientationEvent) 
	{
	    window.addEventListener("deviceorientation", function () 
	    {
	        processGyro(event.alpha, event.beta, event.gamma);  
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

