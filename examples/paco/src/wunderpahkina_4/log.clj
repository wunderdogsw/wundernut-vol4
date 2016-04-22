(ns wunderpahkina-4.log
  (:require [clojure.tools.logging :refer [info]]
            [clojure.string :refer [join]]))

(defn coord->str [[x y z]]
  (str "\"" x y z "\""))

(defn coll->str-list [coll]
  (str "[" (join "," coll) "]"))

(defn steps->str-list [steps]
  (coll->str-list (map (comp coord->str :coordinate) steps)))

(defn result->str-list [result]
  (coll->str-list (map #(str "\"" % "\"") (sort result))))

(defn log-state [coordinate letters visited possible-words next-steps steps-to-check result]
  (info (str "{currentStep: " (coord->str coordinate)
             ", letters: " (str "\"" (apply str letters) "\"")
             ", visited: " (coll->str-list (map coord->str visited))
             ", possibleWordsCount: " (count possible-words)
             ", nextSteps: " (steps->str-list next-steps)
             ", stepsToCheckSize: " (count steps-to-check)
             ", result: " (result->str-list result) "}")))

