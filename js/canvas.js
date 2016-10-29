//this script creates animated paths to a canvas.  Currently it does not run on mobile

if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {

	var gameCanvas = document.getElementById("game-canvas"), 
		avatarImage = new Image(),
		enemeyImage = new Image(),
		enemyX = 15,
		enemyY = 15,
		enemySpeedX = 4,
		enemySpeedY = -0.6,
		hitSide = false,
		start = false,
		offset = 30,
		cxMax = gameCanvas.width - offset,
		cyMax = gameCanvas.height - offset,
		ctx = gameCanvas.getContext("2d");

	var grd = ctx.createRadialGradient(gameCanvas.width*0.5, gameCanvas.height*0.5, 500,gameCanvas.width*0.5, gameCanvas.height*0.5, 0);
		grd.addColorStop(0, '#08ba2d');  
		grd.addColorStop(0.3, '#4c2fc8');
		grd.addColorStop(0.6, '#dc9cb6');
		grd.addColorStop(1, '#13d6d0');

	if ( detectIE() ) {
		//IE cannot render the gradient without falling to a crawl, but a solid colour runs fine
		grd = '#eaa5b8';
	}

	function eraseCanvas() {
		// Changing the canvas size resets what has been drawn	
		gameCanvas.width = gameCanvas.width;	
	}

	function redrawAvatar(e) {
		
		var x = e.offsetX - 30, 					// cache the correct coords
			y = e.offsetY - 30;
			
		
		eraseCanvas();

	}//END of redrawAvatar()

	function moveRandomly() {
		eraseCanvas();

		if (enemyX > cxMax && enemySpeedX > 0) {
			//flips direction		
			enemySpeedX *= -1;
			if(hitSide === false) {
				enemySpeedY = 1;
				hitSide = true;
			}
		} else if( enemyX < (offset - 15) && enemySpeedX < 0) {
			//flips direction
			enemySpeedX *= -1;
		}

		if (enemyY > cyMax - 15 && enemySpeedY > 0) {
			//flips direction		
			enemySpeedY *= -1;
		} else if( enemyY < (offset - 15) && enemySpeedY < 0) {
			//flips direction
			enemySpeedY *= -1;
		}

		enemyX += enemySpeedX;
		enemyY += enemySpeedY;

		ctx.beginPath();  // this seems to create an interesting effect wher a line connects each of the arcs.

		ctx.arc(enemyX,enemyY,15,0,2*Math.PI);	
		
		ctx.arc( -1*enemyX + cxMax,enemyY,15,0,2*Math.PI );

		ctx.arc( enemyX,-1*enemyY + cyMax,15,0,2*Math.PI );

		ctx.arc( -1*enemyX + cxMax,-1*enemyY + cyMax,15,0,2*Math.PI );

		ctx.strokeStyle = grd;
		ctx.stroke();
	}

	function detectIE() {
		//js that will detect IE
	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf('MSIE ');
	    var trident = ua.indexOf('Trident/');

	    if (msie > 0) {
	        // IE 10 or older => return version number
	        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	    }

	    if (trident > 0) {
	        // IE 11 (or newer) => return version number
	        var rv = ua.indexOf('rv:');
	        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	    }

	    // other browser
	    return false;
	}

	var moveTimer = setInterval(moveRandomly, 1000/60);

}