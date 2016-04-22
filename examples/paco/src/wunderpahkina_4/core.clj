(ns wunderpahkina-4.core
  (:require [clojure.set :refer [union]]
            [clojure.string :refer [split-lines]]
            [wunderpahkina-4.log :refer [log-state]])
  (:gen-class))

; For each letter in a cube:
; - Get first neighbors that together with starting letter has possible words.
; - Find neighbors that have valid next letter.
; - Follow each potential path until there are no more neighbors to go to or
;   words from dictionary run out.
; - While following paths store correct words into result set.
;
; Execute (find-words-in-cube) to run the algorithm.

(def dict (split-lines (slurp "dict.txt")))

(def indexed-words (group-by #(take 2 %) dict))

(def cube
  [[[\a \j \f \e]
    [\a \p \u \w]
    [\o \g \m \r]
    [\m \n \x \k]]

   [[\d \n \s \i]
    [\f \o \d \s]
    [\j \e \g \i]
    [\w \k \p \r]]

   [[\e \q \m \f]
    [\r \k \i \d]
    [\d \m \i \r]
    [\e \o \s \d]]

   [[\r \t \s \l]
    [\d \k \p \i]
    [\s \p \o \i]
    [\j \q \d \t]]])

(def all-coordinates
  (for [x (range 4)
        y (range 4)
        z (range 4)]
    [x y z]))

(defn in-bounds? [[x y z]]
  (and
   (and (> x -1) (< x 4))
   (and (> y -1) (< y 4))
   (and (> z -1) (< z 4))))

(defn get-neighbors [[x y z :as slot]]
  (for [nx (range (dec x) (+ x 2))
        ny (range (dec y) (+ y 2))
        nz (range (dec z) (+ z 2))
        :let [neighbor [nx ny nz]]
        :when (and (in-bounds? neighbor)
                   (not= neighbor slot))]
    neighbor))

; Store neighbors for each coordinate into memory to get a performance boost.
(def neighbor-map
  (into {} (map (juxt identity get-neighbors) all-coordinates)))

(defn remove-visited [coordinates visited-set]
  (remove visited-set coordinates))

(defn unvisited-neighbors [coordinate visited-set]
  (-> (neighbor-map coordinate)
      (remove-visited visited-set)))

(defn get-char-at [coordinate]
  (get-in cube coordinate))

(defn neighbor-coordinate-and-letter-list [coordinate visited]
  (let [visited-as-set (set visited)]
    (map (juxt identity get-char-at)
         (unvisited-neighbors coordinate visited-as-set))))

(defn get-path-starts [coordinate two-letter-word-beginnings]
  (filter
   #(two-letter-word-beginnings (second %))
   (map (fn [[coord letter]] [coord [(get-char-at coordinate) letter]])
        (neighbor-coordinate-and-letter-list coordinate []))))

(defn append-letters [letters-so-far neighbor-coord-and-letter-list]
  (map (juxt first #(conj letters-so-far (second %))) neighbor-coord-and-letter-list))

(defn add-candidate-if-match [result candidate possible-words]
  (let [candidate-string (apply str candidate)]
    (if (some #{candidate-string} possible-words)
      (conj result candidate-string)
      result)))

; Step is the basic unit of the path walking algorithm.
; Each valid Step is added to a list that the walk-cube goes through.
(defrecord Step [coordinate letters visited possible-words])

(defn get-valid-next-steps [coordinate
                            potential-next-steps
                            visited
                            possible-words
                            take-letters-for-next-step]
  (reduce (fn [acc [next-coordinate letters]]
            (let [possible-words-for-this
                  (filter (comp (partial = letters)
                                take-letters-for-next-step)
                          possible-words)]
              (if (seq possible-words-for-this)
                (cons (Step. next-coordinate
                             letters
                             (conj visited coordinate)
                             possible-words-for-this) acc)
                acc)))
          '()
          potential-next-steps))

(defn get-next-steps [coordinate letters-so-far visited possible-words]
  (let [neighbor-coord-and-letter-list (neighbor-coordinate-and-letter-list coordinate visited)
        take-letters-for-next-step (partial take (inc (count letters-so-far)))
        next-length-words (map take-letters-for-next-step possible-words)
        potential-next-steps (filter #(boolean (some #{(second %)} next-length-words))
                                     (append-letters
                                      letters-so-far
                                      neighbor-coord-and-letter-list))]
    (get-valid-next-steps coordinate
                          potential-next-steps
                          visited
                          possible-words
                          take-letters-for-next-step)))

(defn walk-cube [second-step]
  (loop [{:keys [coordinate letters visited possible-words]} second-step
         steps-to-check '()
         result #{}]
    (let [updated-result (add-candidate-if-match result letters possible-words)
          [next-step & other-steps :as next-steps] (get-next-steps
                                                    coordinate
                                                    letters
                                                    visited
                                                    possible-words)]
;      (log-state coordinate letters visited possible-words next-steps steps-to-check result)
      (cond
        (seq next-steps) (recur next-step
                                (concat other-steps steps-to-check)
                                updated-result)
        (seq steps-to-check) (recur (first steps-to-check)
                                    (rest steps-to-check)
                                    updated-result)
        :else updated-result))))

(defn search-words-starting-from [root-coordinate]
  (let [two-letter-word-beginnings (set (keys indexed-words))
        coordinate-letters-list (get-path-starts root-coordinate two-letter-word-beginnings)]
    (reduce union
            (pmap (fn [[coord letters]]
                    (walk-cube (Step. coord letters [root-coordinate] (indexed-words letters))))
                  coordinate-letters-list))))

(defn find-words-in-cube []
  (reduce union (pmap search-words-starting-from all-coordinates)))

(defn -main []
  (let [results (find-words-in-cube)]
    (println results)
    (println (count results))
    (System/exit 0)))

