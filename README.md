# The most voluminous pairs of words Wundernut

*Spring 2016*

(Find our other wundernuts [here](https://github.com/wunderdogsw/wunderpahkinas))

(Scroll down for English instructions.) 

Olet saattanut joskus pelata seuraavanlaista peliä: Sinulle annetaan 4x4-ruudukko kirjaimia, ja sinun tulee etsiä siitä mahdollisimman monta sanaa tietyssä ajassa yhdistelemällä vierekkäisiä ruutuja (myös kulmistaan kiinni olevat ruudut lasketaan vierekkäisiksi). Samaa ruutua ei voi käyttää kahta kertaa samassa sanassa. Vastakkaisilla reunoilla olevia kirjaimia ei lasketa vierekkäisiksi. 

Esimerkiksi seuraavasta ruudukosta löytyy sana KANKI:

    R S I U
    E K U V
    O N N A
    P E K S

Kyseisestä pelistä on tehty kännykkäpeliversioita, muiden muassa Sanajahti (suomenkielinen sanasto) ja Wordament (englanninkielinen sanasto).

Laitetaan hommaan kuitenkin hiukan haastetta etsimällä sanoja kirjainruudukon sijaan kirjainkuutiosta! Eli tämänkertaisena Wunderpähkinänä on kirjoittaa ohjelma, joka etsii annetusta 4x4x4-kirjainkuutiosta kaikki vierekkäisistä, kuutionmuotoisista kirjainpalikoista pötkötetyt sanat. Kukin 64:sta kirjainpalikasta edustaa siis yhtä kirjainta. Vierekkäisiksi lasketaan siis palikat, jotka ovat kosketuksissa toisiinsa vähintään kulmistaan. Enimmillään kirjainpalikalla on siis 26 vierekkäistä kirjainpalikkaa.

Sanoiksi kelpaavat [tämän tiedoston](./words.txt) sanat (Lähde: Kotus-sanalista).

Kuutio on määritelty [tässä tiedostossa](./cube.txt).

Säännöt
Voit koodata ratkaisun millä tahansa ohjelmointikielellä.
Eleganttiuden lisäksi ratkaisun pitää toimia oikein ja antaa oikea vastaus. (Vinkki: Brute force -ratkaisu ei ole elegantti)

 
**Wundercube in English**

You might have played the following game: You are given a 4x4 grid of letter squares and you have to find as many words as possible in a certain time by connecting adjacent squares (two squares touching each other's corners are also considered adjacent). A square cannot be used multiple times in a word. Squares at the opposite edges are not considered adjacent.

For example, a (Finnish) word KANKI can be found in the following grid:

    R S I U
    E K U V
    O N N A
    P E K S

Some mobile games have also been created with the same idea: Sanajahti (Finnish dictionary) and Wordament (English dictionary), for example.

Let's add some difficulty to the game by finding words in a letter cube instead of a letter grid! That is to say, this time the wunderpuzzle is to write a program that finds all the words in the given 4x4x4 letter cube, constructed of adjacent cube-shaped letter blocks. Thus, each one of the 64 letter blocks represents one letter. Blocks that touch each other at least at their corners, are counted as adjacent. At maximum, a letter block has 26 adjacent blocks. 

The list of valid words can be found [here](./words.txt) (Source: Kotus-sanalista).

Cube letters can be found [here](./cube.txt).

Rules
You can use any programming language to solve the problem.
Solution must work properly and output the correct answer. (Pro tip: Brute force solution is not very elegant.)

## Oikea vastaus

Wunderkuutio on sulkeutunut positiivisella suosiolla! Vastausten määrä oli runsas ja saimme lisäksi hyvää palautetta.

Pähkinäraatimme valitsi voittajaksi Vesa Norrmanin Python-ratkaisullaan, onnea! 
Voittajaratkaisu oli elegantti, kompakti, nopea ja selkeä. Palkitsimme voittajan GoPro HERO+ actionkameralla, kunniamaineella ja hyvällä koodauskarmalla.

Oikea vastaus pähkinään on 1177 sanaa (myös 1176 hyväksytään koska sanalistassa oli eräs yhden kirjaimen sana).

**Solution**

Wundercube has closed with good popularity! We got great amount of solutions and positive feedback.

Our judging panel chose Vesa Norrman as a winner with his Python solution, congrats!
The winner solution were elegant, compact, fast and clear. We awarded the winner with GoPro HERO+ action camera, an honorable mention and good coding carma.

The right solution of wundercube is 1177 words (also 1176 is acceptable, because there were a certain word of one letter in the word list).