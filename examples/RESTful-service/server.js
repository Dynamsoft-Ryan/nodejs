// http://restify.com/
var restify = require('restify');
var fs = require('fs');
var server = restify.createServer({
  certificate: fs.readFileSync('key-cert.pem'),
  key: fs.readFileSync('key.pem'),
  name: 'MyApp',
});

var dbr = require('../../src/config');
var barcodeTypes = dbr.barcodeTypes;

server.use(restify.bodyParser());

server.get(/.*/, restify.serveStatic({
  directory: __dirname,
  default: 'index.html'
}));

server.post('/dbr', function create(req, res, next) {
  // console.log(req.body);
  // fs.writeFile("log.txt", req.body, function (err) {
  //   if (err) {
  //     return console.log(err);
  //   }

  //   console.log("Base64 saved!");
  // });

  // var data = new Buffer(req.body, 'base64');
  // var file = __dirname + '/' + new Date().getTime() + '.png';
  // var file = __dirname + '/' + 'test.png';

  // fs.writeFile(file, data, function (err) {
  //   dbr.decodeFileAsync(file, barcodeTypes, function (err, msg) {
  //     fs.unlink(file, function (err) {
  //       console.log('Removed cached: ' + file);
  //     });

  //     var final_result = "";
  //     var hasResult = false;
  //     for (index in msg) {
  //       hasResult = true;
  //       var result = msg[index]
  //       final_result += "value: " + result['value'] + "; ";
  //       console.log(result['format']);
  //       console.log(result['value']);
  //       console.log("##################");
  //     }

  //     if (!hasResult) {
  //       final_result = "No barcode detected. ";
  //     }

  //     final_result += new Date();

  //     res.send(200, final_result);
  //     next();
  //   }, "");
  // });
  // let image = str(req.body);
  // console.log(image);
  let data = Buffer.from(req.body);
  dbr.decodeBase64Async(data, barcodeTypes, function (err, msg) {
    // fs.unlink(file, function (err) {
    //   console.log('Removed cached: ' + file);
    // });

    var final_result = "";
    var hasResult = false;
    for (let index in msg) {
      hasResult = true;
      var result = msg[index]
      final_result += "value: " + result['value'] + "; ";
      console.log(result['format']);
      console.log(result['value']);
      console.log("##################");
    }

    if (!hasResult) {
      final_result = "No barcode detected. ";
    }

    final_result += new Date();

    res.send(200, final_result);
    next();
  }, "");
});

server.listen(2018, function () {
  console.log('REST server listening at %s', server.url);
});
