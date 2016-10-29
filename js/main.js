var $window = $(window);
var profilePic = $('.hidden');			
			
if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
	//this is a weird hack that is fixing an issue with chrome where refreshing causes all but the first background-image to not display correctly until the screen is scrolled >.<
	$window.scrollTop(0); 
}

if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
	$(document).ready(function() {

		
		var paraSections = $('section[data-type="background"]');


		//Code to create Parallax effect
		paraSections.each(function() {
			
			var bgObject = $(this);
			bgObject.css({ backgroundPosition: '50% ' + -( $window.scrollTop() - bgObject.offset().top ) + 'px' });

			$window.scroll(function() {

				//divides distance from top of window by the obj's speed attr and stores the value
				var yPos = -( ( $window.scrollTop() - bgObject.offset().top ) / bgObject.data('speed')); 	
				//creates coordinates for a new css background position rule
				var coords = '50% '+ yPos + 'px';							
				//sets the new style rule								
				bgObject.css({ backgroundPosition: coords });				

			});

		});
	});
}

//Scroll to anchor 
$('a.scrollTo').click(function(){
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
    return false;
});

//code that checks if an element is in the viewport and handles animations
function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function revealElement(el) {
    //this function is called when an element is in the viewport
    //el.addClass("about-reveal"); //with will add a class meant for the pofile pick in the about section
    if( !el.hasClass("reveal") ) {
	    el.addClass("reveal").removeClass("hidden");
    }

    //the .reveal-trigger will reveal the parent.  Useful if a large image is hidden, since this func is only run when an element is entirely in the viewport
    if( el.hasClass("reveal-trigger") ) {
    	var parent = el.parent();

    	if ( parent.hasClass("hidden") ) {
    		parent.addClass("reveal").removeClass("hidden").children().each(function(){
    			if ( $(this).hasClass("reveal") || $(this).hasClass("hidden") ) {
    				$(this).removeClass("hidden reveal");
    			}
    		});
    	}
	    
    }
    
} 


function fireIfElementVisible(el, callback) {

    return function() {

    	el.each(function(){
    		var x = $(this);

    		if ( isElementInViewport(x) ) {
	            callback(x);
	        }

    	});

        
    }

}

var aboutViewHandler = fireIfElementVisible(profilePic, revealElement);  //this is where an element is selected for the in viewport event

//jQuery
$window.on('DOMContentLoaded load resize scroll', aboutViewHandler);