(defproject wunderpahkina_4 "1.0.0"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/tools.logging "0.3.1"]
                 [org.slf4j/slf4j-log4j12 "1.7.12"]
                 [log4j/log4j "1.2.17" :exclusions [javax.mail/mail
                                                    javax.jms/jms
                                                    com.sun.jdmk/jmxtools
                                                    com.sun.jmx/jmxri]]]
  :main wunderpahkina-4.core
  :aot :all
  :plugins [[lein-cljfmt "0.3.0"]])
;  :jvm-opts ["-Dcom.sun.management.jmxremote"
;             "-Dcom.sun.management.jmxremote.ssl=false"
;             "-Dcom.sun.management.jmxremote.authenticate=false"
;             "-Dcom.sun.management.jmxremote.port=43210"])
