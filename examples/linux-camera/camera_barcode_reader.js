var dbr = require('../../src/config');
var barcodeTypes = dbr.barcodeTypes;

var v4l2camera = require("v4l2camera");

var cam = new v4l2camera.Camera("/dev/video0");

// list all supported formats
console.log(cam.formats);

// set frame format as YUYV
var format = cam.formats[0];
cam.configSet(format);

if (cam.configGet().formatName !== "YUYV") {
    console.log("YUYV camera required");
    process.exit(1);
}

cam.start();

function capture() {
    cam.capture(function(success) {
        var frame = cam.frameRaw();

        dbr.decodeYUYVAsync(frame, format.width, format.height, barcodeTypes,
            function(msg) {
                var result = null;
                for (index in msg) {
                    result = msg[index]
                    console.log("Format: " + result['format']);
                    console.log("Value : " + result['value']);
                    console.log("##################");
                }
                setTimeout(capture, 0);
            }, "");
    });
}

setTimeout(capture, 0);
