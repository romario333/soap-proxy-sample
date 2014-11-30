'use strict';

var express = require('express');
var app = express();
var _ = require('lodash');
var request = require('request');
var xml2js = require('xml2js').parseString;

var soapRequest = require('fs').readFileSync('soap/convert.xml', {encoding: 'utf8'});

app.get('/api/convert', function (req, res) {
  // http://www.webservicex.net/WS/WSDetails.aspx?WSID=21&CATID=13
  // https://www.npmjs.org/package/request
  request({
    url: 'http://www.webservicex.net/length.asmx',
    method: 'POST',
    headers: {
      'Content-Type': 'application/soap+xml; charset=utf-8'
    },
    body: _.template(soapRequest, {value: req.query.value, from: req.query.from, to: req.query.to})
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      xml2js(body, function(err, bodyJson) {
        if (err) {
          res.status(500).send({
            code: 'errorParsingXml',
            body: body
          });
          return;
        }

        res.send(findProperty(bodyJson, 'ChangeLengthUnitResult'));
      });
    } else {
      res.status(500).send({
        error: {
          code: 'somethingWentWrong',
          body: body,
          error: error
        }
      })
    }
  });
});

app.use(express.static('app'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// helpers

function findProperty(obj, propName) {
  if (obj[propName] !== undefined) {
    return obj[propName]
  }
  if (_.isObject(obj)) {
    for (var prop in obj) {
      var value = findProperty(obj[prop], propName);
      if (value !== undefined) {
        return value;
      }
    }
  }
}
