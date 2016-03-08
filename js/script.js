gyro.frequency = 100;


gyro.startTracking(function(o) {
        // o.x, o.y, o.z for accelerometer
        // o.alpha, o.beta, o.gamma for gyro
        $('#values').html("x: " + o.x + "<br>y: " + o.y + "<br>z: " + o.z + 
        	               "<br>alpa: " + o.alpha + "<br>beta: " + o.beta + "<br>gamma: " + o.gamma);


    });