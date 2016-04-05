function init(){

    gyro.frequency = 100;

    var leftFrame = document.getElementById("left_image").contentWindow;
    var rightFrame = document.getElementById("right_image").contentWindow;

	gyro.startTracking(function(o) {
	        // o.x, o.y, o.z for accelerometer
	        // o.alpha, o.beta, o.gamma for gyro

	        //gamma - while in landscape view:
	        //        flat with screen facing down is 0°, and rotating towards being flat to your face increases to 90° 
	        //        then becomes -89.999 --> -0 


	        $('#values').html("x: " + o.x + "<br>y: " + o.y + "<br>z: " + o.z + 
	        	               "<br>alpa: " + o.alpha + "<br>beta: " + o.beta + "<br>gamma: " + o.gamma);

			if(o.gamma > 0 && o.gamma < 85){
				//tilting up in landscape
				leftFrame.$('document').trigger('tiltup');
				rightFrame.$('document').trigger('tiltup');
				

			}else if(o.gamma > -85 && o.gamma < 0){
				//tilting down in landscape
				//leftFrame.$('document').trigger('tiltdown');
				//rightFrame.$('document').trigger('tiltdown');
				
			}else{
				//leftFrame.$('document').trigger('notilt');
				//rightFrame.$('document').trigger('notilt');
			}
	    });
	}



$(init());

