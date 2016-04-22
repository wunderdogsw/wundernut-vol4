module Main where

import Prelude hiding (words)

import qualified Data.Array.IArray as Array
import Data.ByteString (ByteString)
import qualified Data.ByteString.Char8 as BS
import qualified Data.List as List
import Data.Trie (Trie)
import qualified Data.Trie as Trie

newtype CubeIndex = CubeIndex (Int, Int, Int) deriving (Array.Ix, Eq, Ord, Show)

newtype Cube = Cube (Array.Array CubeIndex Char) deriving (Eq, Ord, Show)

newtype Path = Path (Cube, [CubeIndex], ByteString) deriving (Eq, Ord)

instance Show Path where
  show (Path (Cube array, indices, _)) =
    List.intercalate ", " $ map (\ci@(CubeIndex index) -> show (index, array Array.! ci)) indices

mkPath :: Cube -> CubeIndex -> Path
mkPath cube@(Cube arr) index = Path (cube, [index], BS.singleton (arr Array.! index))

pathHead :: Path -> CubeIndex
pathHead (Path (_, indices, _)) =
  head indices

grow :: Path -> [Path]
grow path@(Path (cube@(Cube array), indices, w)) =
  map (\n -> Path (cube, n : indices, BS.snoc w (array Array.! n))) frontier
  where frontier = filter (`notElem` indices) (neighbors (pathHead path))

word :: Path -> ByteString
word (Path (_, _, w)) = w

hits :: Trie Bool -> Cube -> CubeIndex -> [ByteString]
hits trie cube start =
  hits' [mkPath cube start]
  where hits' :: [Path] -> [ByteString]
        hits' [] = []
        hits' paths =
          let potentials = filter (\p -> not (null (Trie.submap (word p) trie))) paths
              exacts     = filter (\p -> length (Trie.lookup (word p) trie) == 1) paths
          in  List.nub $ map word exacts ++ hits' (concatMap grow potentials)

mkCube :: String -> Cube
mkCube chars =
  Cube $ Array.array (CubeIndex (1, 1, 1), CubeIndex (4, 4, 4)) (zip indices chars)
  where indices = [CubeIndex (x, y, z) | x <- [1..4], y <- [1..4], z <- [1..4]]

neighbors :: CubeIndex -> [CubeIndex]
neighbors (CubeIndex (x, y, z)) =
  [CubeIndex (x', y', z') | x' <- [(x - 1)..(x + 1)],
                            x' >= 1 && x' <= 4,
                            y' <- [(y - 1)..(y + 1)],
                            y' >= 1 && y' <= 4,
                            z' <- [(z - 1)..(z + 1)],
                            z' >= 1 && z' <= 4,
                            (x', y', z') /= (x, y, z)]

cube1 :: Cube
cube1 = mkCube "ajfeapuwogmrmnxkdnsifodsjegiwkpreqmfrkiddmireosdrtsldkpispoijqdt"

path1 :: Path
path1 = mkPath cube1 (CubeIndex (1, 1, 1))

dictTxt :: IO ByteString
dictTxt = BS.readFile "dict.txt"

mkTrie :: ByteString -> Trie Bool
mkTrie content =
  let words = BS.split '\n' content
  in  Trie.fromList $ zip words (repeat True)

trie1 :: IO (Trie Bool)
trie1 = fmap mkTrie dictTxt

hits1 :: IO [ByteString]
hits1 = do
  trie <- trie1
  let cube@(Cube array) = cube1
  return $ concatMap (hits trie cube) (Array.indices array)

main :: IO ()
main = do
  h <- hits1
  let h' = List.sort . List.nub $ h
  print h'
  print $ length h'
