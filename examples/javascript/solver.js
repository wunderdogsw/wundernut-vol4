var _ = require('lodash'),
  fs = require('fs')

var data = fs.readFileSync('./dict.txt', 'utf8'),
  words = data.split('\n')

var SIZE = 4
var DIM = 3

var indexWords = function (words) {
  return _.chain(words).map(function (word, index) {
    return { word: word.substring(0, 2), index: index }
  }).uniqBy(function (indexed) {
    return indexed.word
  }).value()
}

var createCube = function (letterStr, dim, coords) {
  if (dim > 0) {
    return _.chain(_.range(SIZE)).map(function (c, index) {
      var len = Math.pow(SIZE, dim - 1)
      var clonedCoords = _.cloneDeep(coords)
      clonedCoords.push(index)
      return createCube(letterStr.substring(index * len, (index + 1) * len), dim - 1, clonedCoords)
    }).value();
  } else {
    return { x: coords[0], y: coords[1], z: coords[2], letter: letterStr, visit: false }
  }
}

var findUnvisitNeighbors = function (cube, cell) {
  var unvisit = []
  for (var x = Math.max(0, cell.x - 1); x <= Math.min(cell.x + 1, SIZE - 1); x++) {
    for (var y = Math.max(0, cell.y - 1); y <= Math.min(cell.y + 1, SIZE - 1); y++) {
      for (var z = Math.max(0, cell.z - 1); z <= Math.min(cell.z + 1, SIZE - 1); z++) {
        var n = cube[x][y][z]
        if (!n.visit && !(x === cell.x && y === cell.y && z === cell.z))
          unvisit.push(n)
      }
    }
  }
  return unvisit
}

var filterWords = function (words, str, indexedWords) {
  if (str.length < 2)
    return words

  if (str.length === 2) {
    var indexObj = _.find(indexedWords, { word: str })
    if (!indexObj)
      return []

    var startIndex = indexObj.index
    var endArrIndex = indexedWords.indexOf(indexObj) + 1
    var endIndex = null
    if (endArrIndex >= indexedWords.length) {
      endIndex = words.length
    } else {
      endIndex = indexedWords[endArrIndex].index
    }

    return words.slice(startIndex, endIndex)
  }

  return _.filter(words, function (word) {
    return word.indexOf(str) === 0
  })
}

var searchCorrect = function (words, str) {
  return words[0] === str && str
}

var search = function (cube, cell, str, words) {
  str += cell.letter
  var possibleWords = filterWords(words, str, indexedWords)

  if (!possibleWords.length)
    return []

  var foundWords = []
  var correct = searchCorrect(possibleWords, str)
  if (correct)
    foundWords.push(correct)

  var clonedCube = cloneCube(cube, DIM)
  clonedCube[cell.x][cell.y][cell.z].visit = true
  var neighbors = findUnvisitNeighbors(clonedCube, cell)

  var newStr = _.clone(str)
  _.each(neighbors, function (neighbor) {
    foundWords.push(search(clonedCube, neighbor, newStr, possibleWords))
  })

  return _.flattenDeep(foundWords)
}

var cloneCube = function (c, dim) {
  if (dim > 0)
    return _.map(c, function (c) {
      return cloneCube(c, dim - 1);
    })
  else return { x: c.x, y: c.y, z: c.z, letter: c.letter, visit: c.visit }
}

var solve = function (letterStr) {
  var cube = createCube(letterStr, DIM, [])
  var found = _.chain(cube)
  .flattenDeep()
  .reduce(function (f, cell) {
    var clonedCube = cloneCube(cube, DIM)
    f.push(search(clonedCube, clonedCube[cell.x][cell.y][cell.z], '', words))
    return _.flattenDeep(f)
  }, [])
  .uniq()
  //.sortBy(function (word) { return -word.length })
  .value()

  return found
}

var indexedWords = indexWords(words)

module.exports = {
  solve: solve
}

console.log(solve("ajfeapuwogmrmnxkdnsifodsjegiwkpreqmfrkiddmireosdrtsldkpispoijqdt").length)
