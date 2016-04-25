import collections

wordsFile = open('words.txt', 'r')
wordsText = wordsFile.read().decode('utf-8-sig')
words = filter(None, wordsText.upper().split('\n'))

cubeFile = open('cube.txt', 'r')
cubeText = cubeFile.read()
cube = cubeText.replace('\n', '')

def adjacent(a, b):
    return (a != b and
            abs(a % 4 - b % 4) < 2 and
            abs((a % 16) // 4 - (b % 16) // 4) < 2 and
            abs((a // 16) - (b // 16)) < 2)

adjacentTable = [set([a for a in range(64) if adjacent(a, b)]) for b in range(64)]

cubePositions = collections.defaultdict(list)
for i, l in enumerate(cube):
    cubePositions[l].append(i)

def searchCube(word, pos, used, last):
    if len(word) == pos:
        return True
    newused = used.copy()
    if last is not None:
        newused.add(last)
    for square in cubePositions[word[pos]]:
        if ((last is None or square in adjacentTable[last]) and
            square not in used and
            searchCube(word, pos + 1, newused, square)):
            return True
    return False

validWords = [word for word in words if searchCube(word, 0, set(), None)]

print(len(validWords))
