**Live site:** I've deployed eSudoku [here.]

 

About
-----

eSudoku is a mobile friendly Express-React-Bootstrap multi-page web app. My
friend Derrick wrote the original sudoku board validation API which I’ve
extended and which now exists in src/js/LogicBoard.js and src/js/LogicCell.js.
I’m the author of 100% of the rest of the code. The code itself is well
documented, but the directory structure isn’t. src/js holds the files that are
bundled by Webpack to create the Sudoku board. The html pages of the site are
located in src/html and their corresponding css files are in public/css. The
node server is server.js which imports board.js.

 

Running locally
---------------

1.  Clone this repo

2.  cd eSudoku/

3.  npm install

4.  npm start

5.  Visit <http://localhost:5000>
