
var imageWidth = 5412;
var imageHeight = 7216;

var ANCESTOR_RECT = {x: 0, y: 0, width: imageWidth, height: imageHeight, parent: null}; 

var parentRect = ANCESTOR_RECT; 
var currentRect = ANCESTOR_RECT;

function increaseZoomLevel(){
    parentRect = currentRect;
}

function decreaseZoomLevel(){
    if(!parentRect.parent === null){
        parentRect = parentRect.parent;
    }else{
        console.log("Already at Highest Level");
        currentRect = ANCESTOR_RECT;
        parentRect = ANCESTOR_RECT;
    }
}

function panTo(tileNum){
    currentRect = generateRect(parentRect, tileNum);
    zoomPanTo(currentRect);
}


function generateRect(rect, tileNum){
    var tileString = "ERROR";

    switch(tileNum){
        case 0:
            tileString = "top left";
            break;
        case 1:
            tileString = "top center";        
            break;
        case 2:
            tileString = "top right";
            break;
        case 3:
            tileString = "middle left";
            break;
        case 4:
            tileString = "center";
            break;
        case 5:
            tileString = "middle right";
            break;
        case 6:
            tileString = "bottom left";
            break;
        case 7:
            tileString = "bottom center";
            break;
        case 8:
            tileString = "bottom righr";
            break;

    }
    console.log("Generating Zoom Rect at " + tileString + " tile.");

    var topLeftPointX = rect.x;
    var topLeftPointY = rect.y;
    var width = rect.width;
    var height = rect.height;

    if(tileNum <= 2){
        return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY, width: width/3, height: height/3, parent: rect};
    }else if(tileNum <= 5){
        tileNum -= 3;
        return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY + width/3, width: width/3, height: height/3, parent: rect};
    }else{
        tileNum -= 6;
        return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY + (2*width)/3, width: width/3, height: height/3, parent: rect};
    }
}

function zoomPanTo(rect){
    console.log("Zooming/Panning to");
    if(rect === null){
        console.log("Already at highest level.");
        return;
    };
    var zRectPts = [{x: rect.x, y: rect.y},
                    {x: rect.x + rect.width, y: rect.y},
                    {x: rect.x, y: rect.y + rect.height},
                    {x: rect.x + rect.width, y: rect.y + rect.height}];

    Z.viewportCurrent.zoomAndPanToZoomRectangle(zRectPts);
}


function getCenter(){
    return Z.viewportCurrent.calculateCurrentCenterCoordinates();
}

function getBoundingBox(){
    return Z.viewportCurrent.getViewportDisplayBoundingBoxInPixels(true);
}


// Z.Utils.addEventListener(document, 'click', function(e){
//     console.log(getBoundingBox());
// });


Z.Utils.addEventListener(document, 'tilt-up', function(e){
    Z.viewportCurrent.pan('up');
    Z.viewportCurrent.updateView(true);
});

Z.Utils.addEventListener(document, 'tilt-down', function(e){
    Z.viewportCurrent.pan('down');
    Z.viewportCurrent.updateView(true);
});

Z.Utils.addEventListener(document, 'no-vertical-tilt', function(e){
    Z.viewportCurrent.pan('verticalStop');
    Z.viewportCurrent.updateView(true);
});

Z.Utils.addEventListener(document, 'tilt-left', function(e){
    Z.viewportCurrent.pan('left');
    Z.viewportCurrent.updateView(true);
});

Z.Utils.addEventListener(document, 'tilt-right', function(e){
    Z.viewportCurrent.pan('right');
    Z.viewportCurrent.updateView(true);
});

Z.Utils.addEventListener(document, 'no-horizontal-tilt', function(e){
    Z.viewportCurrent.pan('horizontalStop');
    Z.viewportCurrent.updateView(true);
});

Z.Utils.addEventListener(document, 'zoom-start', function(e){

    Z.viewportCurrent.zoom('in');
    Z.viewportCurrent.updateView(true);

});

Z.Utils.addEventListener(document, 'zoom-end', function(e){

    Z.viewportCurrent.zoom('stop');
    Z.viewportCurrent.updateView(true);

});

Z.Utils.addEventListener(document, 'zoom-out', function(e){

    Z.viewportCurrent.zoom('out');
    Z.viewportCurrent.updateView(true);

    setTimeout(function(){
        Z.viewportCurrent.zoom('stop');
        Z.viewportCurrent.updateView(true);
    }, 500);

});

window.addEventListener("orientationchange", function() {
    document.location.reload(true);
}, false);
