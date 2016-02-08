#!/usr/bin/env node

var simplify = require('./')
var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))
var concat = require('concat-stream')
var stdin

var tolerance = argv.t || argv.tolerance || 0.001
tolerance = +tolerance // cast to Number

if (!process.stdin.isTTY || argv._[0] === '-') {
  stdin = process.stdin
} else {
  stdin = fs.createReadStream(argv._[0])
}

// buffer all input TODO streaming simplification
stdin.pipe(concat(function (buffer) {
  try {
    var geojson = JSON.parse(buffer)
  } catch (e) {
    return console.error(e)
  }
  var result = simplify(geojson, tolerance)
  if (result instanceof Error) return console.error(result)
  console.log(JSON.stringify(result, null, 2))
}))
