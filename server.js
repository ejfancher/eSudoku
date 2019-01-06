const express = require('express');
const fs = require('fs');
const boards = require('./boards.js');

const app = express();

const cwd = __dirname

// hosting static files
var static_files_root_dir = cwd + '/src/css'
app.use(express.static(static_files_root_dir))

app.get('/', (req, res) => {
	var target_file = cwd+'/src/html/home_page.html'
	res.sendFile(target_file)
})

app.get('/game', (req, res) => {
  const diff = req.query.diff
/* if a difficulty option came through in the query portion of the
requested resource, inject a random board of that difficulty into
the game page and serve that page */
  if (diff != null && diff != "") {
    const board_string = boards.randomBoard(diff)
    var data = fs.readFileSync('./src/html/game_page.html', 'utf8')
    var split_point = data.indexOf('<script src="./bundle.js">')
    var before = data.slice(0, split_point)
    var after = data.slice(split_point)
    data = before+'<script type="text/javascript">var board_string=\''+board_string+'\'</script>\n'+after
    res.send(data)
  }
  else {
    res.redirect('/game?diff=easy')
  }
})

app.get('/bundle.js', (req, res) => {
  var target_file = cwd+'/src/bundle/bundle.js'
  res.sendFile(target_file)
})

app.get('/map', (req, res) => {
  var target_file = cwd+'/src/html/site_map.html'
  res.sendFile(target_file)
})

// check for port env. variable to use when being ran on heroku server
// otherwise run on port 5000 locally
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port);
