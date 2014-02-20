// TODO "real" test suite
var test = require('tape')
var fs = require('fs')
var simplify = require('./')

test('FeatureCollection w/ a LineString in it', function(t) {
  var fcLine = JSON.parse(fs.readFileSync('./test-data/oakland-route.geojson'))
  var len = fcLine.features[0].geometry.coordinates.length
  var simplified = simplify(fcLine, 0.001)
  var newLen = simplified.features[0].geometry.coordinates.length
  t.true(newLen < len, 'should get simplified')
  t.end()
})

test('FeatureCollection w/ a MultiPolygon in it', function(t) {
  var fsMp = JSON.parse(fs.readFileSync('./test-data/alaska.geojson'))
  var len = JSON.stringify(fsMp, null, '  ').split('\n').length
  var simplified = simplify(fsMp, 0.5)
  var newLen = JSON.stringify(simplified, null, '  ').split('\n').length
  t.true(newLen < len, 'should get simplified')
  t.end()
})

// TODO tests for other types (send me a PR :D)
