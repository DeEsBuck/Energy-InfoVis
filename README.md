# Energy-InfoVis
Gestaltung einer Informationsvisualisierung zur Untersuchung des Stromverbrauchs privater Haushalte in den jeweiligen Stadtteilen Kölns

Um die SVG Grafiken zu rendern, musst Du die Seite über einen Nodejs HTTP-Server starten.
Ich habe die kleine Node Lösung http-server verwendet.

Einfacher ist es das CDN im Header auskommentieren, da ich lokal mit den nodejs http-server entwickle, wird die d3/de.js verwendet.

Also in Zeile 5 der index.html <script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script> aktivieren.

Für weitere Infos bitte das D3 Repository von Mike Bostock https://github.com/d3/d3 lesen.


Für die Legende habe ich das Framework von https://github.com/jgoodall/d3-colorlegend verwendet.

die Statdkarte ist aus https://upload.wikimedia.org/wikipedia/commons/f/f3/Cologne_subdivisions.svg
 entnommen und leicht modifiziert worden.