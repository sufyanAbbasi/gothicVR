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
}

var imageWidth = 5412;
var imageHeight = 7216;

var ANCESTOR_RECT = {x: 0, y: 0, width: imageWidth, height: imageHeight, parent: null}; 

var parentRect = ANCESTOR_RECT; 
var currentRect = ANCESTOR_RECT;

var currentlyPanning = false;

var panningTimer = null;


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
    if(!currentlyPanning){
        panningTimer = clearTimeout();
        currentRect = generateRect(parentRect, tileNum);
        zoomPanTo(currentRect);
    }else{
        console.log("Wait for pan to finish");
        panningTimer = setTimeout(function(){
            currentlyPanning = false;
        }, 1000);
    }
    
}


function generateRect(rect, tileNum){
    var tileString = "ERROR";

    switch(tileNum){
        case tileEnum.TOP_LEFT:
            tileString = "top left";
            break;
        case tileEnum.TOP_MIDDLE:
            tileString = "top middle";        
            break;
        case tileEnum.TOP_RIGHT:
            tileString = "top right";
            break;
        case tileEnum.MIDDLE_LEFT:
            tileString = "middle left";
            break;
        case tileEnum.CENTER:
            tileString = "center";
            break;
        case tileEnum.MIDDLE_RIGHT:
            tileString = "middle right";
            break;
        case tileEnum.BOTTOM_LEFT:
            tileString = "bottom left";
            break;
        case tileEnum.BOTTOM_MIDDLE:
            tileString = "bottom middle";
            break;
        case tileEnum.BOTTOM_RIGHT:
            tileString = "bottom right";
            break;

    }
    console.log("Generating Zoom Rect at " + tileString + " tile.");

    var topLeftPointX = rect.x;
    var topLeftPointY = rect.y;
    var width = rect.width;
    var height = rect.height;

    if(tileNum <= tileEnum.TOP_RIGHT){
        return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY, width: width/3, height: height/3, parent: rect};
    }else if(tileNum <= tileEnum.MIDDLE_RIGHT){
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

    panningTimer = clearTimeout();
    currentlyPanning = true;
    Z.viewportCurrent.zoomAndPanToZoomRectangle(zRectPts, finishedPan);
}

function finishedPan(){
    console.log("Zoom Finished");
    panningTimer = setTimeout(function(){
        currentlyPanning = false;
    }, 250);
}


function getCenter(){
    return Z.viewportCurrent.calculateCurrentCenterCoordinates();
}

function getBoundingBox(){
    return Z.viewportCurrent.getViewportDisplayBoundingBoxInPixels(true);
}


Z.Utils.addEventListener(document, 'tilt-top-left', function(e){
    panTo(tileEnum.TOP_LEFT);
});

Z.Utils.addEventListener(document, 'tilt-top-middle', function(e){
    panTo(tileEnum.TOP_MIDDLE);
});

Z.Utils.addEventListener(document, 'tilt-top-right', function(e){
    panTo(tileEnum.TOP_RIGHT);
});

Z.Utils.addEventListener(document, 'tilt-middle-left', function(e){
    panTo(tileEnum.MIDDLE_LEFT);
});

Z.Utils.addEventListener(document, 'tilt-center', function(e){
    panTo(tileEnum.CENTER);
});

Z.Utils.addEventListener(document, 'tilt-middle-right', function(e){
    panTo(tileEnum.MIDDLE_RIGHT);
});

Z.Utils.addEventListener(document, 'tilt-bottom-left', function(e){
    panTo(tileEnum.BOTTOM_LEFT);
});

Z.Utils.addEventListener(document, 'tilt-bottom_middle', function(e){
    panTo(tileEnum.BOTTOM_MIDDLE);
});

Z.Utils.addEventListener(document, 'tilt-bottom-right', function(e){
    panTo(tileEnum.BOTTOM_RIGHT);
});



Z.Utils.addEventListener(document, 'zoom-in', function(e){

    increaseZoomLevel();

});

Z.Utils.addEventListener(document, 'zoom-out', function(e){

   decreaseZoomLevel();

});

window.addEventListener("orientationchange", function(e) {
    document.location.reload(true);
}, false);


