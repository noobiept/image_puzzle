'use strict';

var ShowImage;
(function(ShowImage) {

var IMAGE;
var OVERLAY;

ShowImage.init = function()
{
IMAGE = document.getElementById( 'OriginalImage' );
IMAGE.onclick = close;

OVERLAY = document.getElementById( 'Overlay' );
OVERLAY.onclick = close;
};


ShowImage.show = function( id )
{
IMAGE.src = 'images/' + id + '.jpeg';
IMAGE.classList.remove( 'hidden' );
OVERLAY.classList.remove( 'hidden' );
};


function close()
{
IMAGE.classList.add( 'hidden' );
OVERLAY.classList.add( 'hidden' );
}


})(ShowImage || (ShowImage = {}));