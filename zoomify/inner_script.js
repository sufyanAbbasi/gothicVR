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