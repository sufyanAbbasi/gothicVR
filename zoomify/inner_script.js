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

var imageWidth = 5412;
var imageHeight = 7216;

var ANCESTOR_RECT = {x: 0, y: 0, width: imageWidth, height: imageHeight, parent: null}; 

var parentRect = ANCESTOR_RECT; 
var viewingRect = ANCESTOR_RECT;


var currentZoom = 0;

document.addEventListener("onload", function(){
    box = getBoundingBox();
    viewingRect = {x: box.x, y: box.y, width: box.width, height: box.height, parent: ANCESTOR_RECT};
    parentRect = {x: box.x, y: box.y, width: box.width, height: box.height, parent: ANCESTOR_RECT};
});

var updateTimer = null;

function updateView(){
    zoomPanTo(viewingRect, finishedPan);
}

function finishedPan(){
    console.log("Pan Finished");
}


function increaseZoomLevel(){
    console.log("Zooming in");
    currentZoom++;
    parentRect = viewingRect;
    dispatchToParent('zoomedTo', {"zoom": currentZoom});
}

function decreaseZoomLevel(){
    console.log("Zooming Out");
    if(parentRect.parent != null){
        parentRect = parentRect.parent;
        currentZoom--;
        dispatchToParent('zoomedTo', {"zoom": currentZoom});
    }else{
        console.log("Already at Highest Level");
        viewingRect = ANCESTOR_RECT;
        parentRect = ANCESTOR_RECT;
        currentZoom = 0;
        dispatchToParent('zoomedTo', {"zoom": currentZoom});
    }
}

function panTo(tileNum){
    clearTimeout(updateTimer);
    viewingRect = generateRect(parentRect, tileNum);
    updateTimer = setTimeout(updateView, 800);
    
}

function generateRect(rect, tileNum){
    var tileString = "ERROR";

    // switch(tileNum){
    //     case tileEnum.TOP_LEFT:
    //         tileString = "top left";
    //         break;
    //     case tileEnum.TOP_MIDDLE:
    //         tileString = "top middle";        
    //         break;
    //     case tileEnum.TOP_RIGHT:
    //         tileString = "top right";
    //         break;
    //     case tileEnum.MIDDLE_LEFT:
    //         tileString = "middle left";
    //         break;
    //     case tileEnum.CENTER:12
    //         tileString = "center";
    //         break;
    //     case tileEnum.MIDDLE_RIGHT:
    //         tileString = "middle right";
    //         break;
    //     case tileEnum.BOTTOM_LEFT:
    //         tileString = "bottom left";
    //         break;
    //     case tileEnum.BOTTOM_MIDDLE:
    //         tileString = "bottom middle";
    //         break;
    //     case tileEnum.BOTTOM_RIGHT:
    //         tileString = "bottom right";
    //         break;

    // }
    //console.log("Generating Zoom Rect at " + tileString + " tile.");

    var topLeftPointX = rect.x;
    var topLeftPointY = rect.y;
    var width = rect.width;
    var height = rect.height;

    if(rect.parent == null){
        if(tileNum <= tileEnum.TOP_RIGHT){
            return {x: topLeftPointX, y: topLeftPointY, width: width, height: height/2, parent: rect};
        }else if(tileNum <= tileEnum.MIDDLE_RIGHT){
            tileNum -= 3;
            return {x: topLeftPointX, y: topLeftPointY + height/2, width: width, height: height/2, parent: rect};
        }else{
            tileNum -= 6;
            return {x: topLeftPointX, y: topLeftPointY + (2*height)/2, width: width, height: height/2, parent: rect};
        }
    }else{
        if(tileNum <= tileEnum.TOP_RIGHT){
            console.log("Top Row");
            return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY, width: width/3, height: height/2, parent: rect};
        }else if(tileNum <= tileEnum.MIDDLE_RIGHT){
            console.log("Middle Row");
            tileNum -= 3;
            return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY + height/2, width: width/3, height: height/2, parent: rect};
        }else{
            console.log("Bottom Row")
            tileNum -= 6;
            return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY + (2*height)/2, width: width/3, height: height/2, parent: rect};
        }
    }
}

function getCenter(){
    return Z.viewportCurrent.calculateCurrentCenterCoordinates();
}

function getBoundingBox(){
    var box = Z.viewportCurrent.getViewportDisplayBoundingBoxInPixels(true);
    return {x: box.l, y: box.t, width: box.r - box.l, height: box.b - box.t};
}

function zoomPanTo(rect, callback){
    //console.log("Zooming/Panning to");
    var zRectPts = [{x: rect.x, y: rect.y},
                    {x: rect.x + rect.width, y: rect.y},
                    {x: rect.x, y: rect.y + rect.height},
                    {x: rect.x + rect.width, y: rect.y + rect.height}];

    Z.viewportCurrent.zoomAndPanToZoomRectangle(zRectPts, callback);
}


Z.Utils.addEventListener(document, 'pan-to', function(e){
    console.log("Recieved: pan-to: " + e.detail.tile);
    panTo(e.detail.tile);
});


Z.Utils.addEventListener(document, 'zoom-in', function(e){
    console.log("Recieved: zoom-in");
    increaseZoomLevel();

});

Z.Utils.addEventListener(document, 'zoom-out', function(e){
    console.log("Recieved: zoom-out");
   decreaseZoomLevel();

});

window.addEventListener("orientationchange", function(e) {
    document.location.reload(true);
}, false);


function dispatchToParent(eventString, data){
    parent.document.dispatchEvent(new CustomEvent(eventString, {"detail" : data}));
}




