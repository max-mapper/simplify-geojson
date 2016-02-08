var test = require('tape')
var fs = require('fs')
var concat = require('concat-stream')
var child_process = require('child_process')
var spawn = child_process.spawn
var simplify = require('./')

test('FeatureCollection w/ a LineString in it', function (t) {
  var fcLine = JSON.parse(fs.readFileSync('./test-data/oakland-route.geojson'))
  var len = fcLine.features[0].geometry.coordinates.length
  var simplified = simplify(fcLine, 0.001)
  var newLen = simplified.features[0].geometry.coordinates.length
  t.true(newLen < len, 'should get simplified (' + newLen + ' < ' + len + ')')
  t.end()
})

test('FeatureCollection w/ a LineString in it (cli)', function (t) {
  t.plan(1)

  var file = './test-data/oakland-route.geojson'
  var fcLine = JSON.parse(fs.readFileSync('./test-data/oakland-route.geojson'))
  var len = fcLine.features[0].geometry.coordinates.length
  var proc = spawn('./cli.js', [file, '-t 0.001'])

  proc.stderr.on('data', function (data) {
    t.error(data.toString(), 'does not error')
  })

  proc.stdout.pipe(concat(function (buffer) {
    var simplified = JSON.parse(buffer.toString())
    var newLen = simplified.features[0].geometry.coordinates.length
    t.true(newLen < len, 'should get simplified (' + newLen + ' < ' + len + ')')
  }))
})

test('FeatureCollection w/ a MultiPolygon in it', function (t) {
  var fsMp = JSON.parse(fs.readFileSync('./test-data/alaska.geojson'))
  var len = JSON.stringify(fsMp, null, '  ').split('\n').length
  var simplified = simplify(fsMp, 0.5)
  var newLen = JSON.stringify(simplified, null, '  ').split('\n').length
  t.true(newLen < len, 'should get simplified (' + newLen + ' < ' + len + ')')
  t.end()
})

test('FeatureCollection w/ a MultiPolygon in it (cli)', function (t) {
  t.plan(1)

  var file = './test-data/alaska.geojson'
  var fsMp = JSON.parse(fs.readFileSync(file))
  var len = JSON.stringify(fsMp, null, '  ').split('\n').length
  var proc = spawn('./cli.js', [file, '-t 0.5'])

  proc.stderr.on('data', function (data) {
    t.error(data.toString(), 'does not error')
  })

  proc.stdout.pipe(concat(function (buffer) {
    var geoJson = JSON.parse(buffer.toString())
    var newLen = JSON.stringify(geoJson, null, '  ').split('\n').length
    t.true(newLen < len, 'should get simplified (' + newLen + ' < ' + len + ')')
  }))
})

// TODO tests for other types (send me a PR :D)
