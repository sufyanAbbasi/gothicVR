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

var currentTileRow = tileEnum.MIDDLE_ROW;

var currentTileColumn = tileEnum.MIDDLE_COLUMN;

var updateTimer = null;


function updateView(){
    zoomPanTo(viewingRect, finishedPan);
}

function finishedPan(){
    console.log("Pan Finished");
}


function increaseZoomLevel(){
    parentRect = viewingRect;
}

function decreaseZoomLevel(){
    if(!parentRect.parent === null){
        parentRect = parentRect.parent;
    }else{
        console.log("Already at Highest Level");
        viewingRect = ANCESTOR_RECT;
        parentRect = ANCESTOR_RECT;
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
            return {x: topLeftPointX, y: topLeftPointY, width: width, height: height/3, parent: rect};
        }else if(tileNum <= tileEnum.MIDDLE_RIGHT){
            tileNum -= 3;
            return {x: topLeftPointX, y: topLeftPointY + height/3, width: width, height: height/3, parent: rect};
        }else{
            tileNum -= 6;
            return {x: topLeftPointX, y: topLeftPointY + (2*height)/3, width: width, height: height/3, parent: rect};
        }
    }else{
        if(tileNum <= tileEnum.TOP_RIGHT){
            return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY, width: width/3, height: height/3, parent: rect};
        }else if(tileNum <= tileEnum.MIDDLE_RIGHT){
            tileNum -= 3;
            return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY + height/3, width: width/3, height: height/3, parent: rect};
        }else{
            tileNum -= 6;
            return {x: topLeftPointX + tileNum *(width/3), y: topLeftPointY + (2*height)/3, width: width/3, height: height/3, parent: rect};
        }
    }
}

function zoomPanTo(rect, callback){
    //console.log("Zooming/Panning to");
    var zRectPts = [{x: rect.x, y: rect.y},
                    {x: rect.x + rect.width, y: rect.y},
                    {x: rect.x, y: rect.y + rect.height},
                    {x: rect.x + rect.width, y: rect.y + rect.height}];

    Z.viewportCurrent.zoomAndPanToZoomRectangle(zRectPts, callback);
}

function getCenter(){
    return Z.viewportCurrent.calculateCurrentCenterCoordinates();
}

function getBoundingBox(){
    return Z.viewportCurrent.getViewportDisplayBoundingBoxInPixels(true);
}


Z.Utils.addEventListener(document, 'tilt-up', function(e){

        currentTileRow = tileEnum.TOP_ROW;

        panTo(currentTileRow + currentTileColumn);

});

Z.Utils.addEventListener(document, 'no-vertical-tilt', function(e){

        currentTileRow = tileEnum.MIDDLE_ROW;

        panTo(currentTileRow + currentTileColumn);

});

Z.Utils.addEventListener(document, 'tilt-down', function(e){

        currentTileRow = tileEnum.BOTTOM_ROW;

        panTo(currentTileRow + currentTileColumn);

});

Z.Utils.addEventListener(document, 'tilt-left', function(e){

        currentTileColumn = tileEnum.LEFT_COLUMN;

        panTo(currentTileRow + currentTileColumn);


});

Z.Utils.addEventListener(document, 'no-horizontal-tilt', function(e){

        currentTileColumn = tileEnum.MIDDLE_COLUMN;

        panTo(currentTileRow + currentTileColumn);

});

Z.Utils.addEventListener(document, 'tilt-right', function(e){

        currentTileColumn = tileEnum.RIGHT_COLUMN;

        panTo(currentTileRow + currentTileColumn);

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






