const express = require('express');
const path = require('path');
const fs = require('fs');
const boards = require('./boards.js');

const app = express();

const cwd = path.resolve()

var static_files_root_dir = path.resolve() + '/public'
app.use(express.static(static_files_root_dir))

app.get('/', (req, res) => {
	var target_file = cwd+'/src/html/home_page.html'
	res.sendFile(target_file)
})

app.get('/game', (req, res) => {
  const diff = req.query.diff
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




app.get('/one', (req, res) => {
  var target_file = cwd+'/src/html/game_page_ch.html'
  res.sendFile(target_file)
})

app.get('/two', (req, res) => {
  var target_file = cwd+'/src/html/game_page_number.html'
  res.sendFile(target_file)
})

app.get('/three', (req, res) => {
  var target_file = cwd+'/src/html/game_page_number_pat.html'
  res.sendFile(target_file)
})

app.get('/four', (req, res) => {
  var target_file = cwd+'/src/html/game_page_tel.html'
  res.sendFile(target_file)
})

app.get('/bundle.js', (req, res) => {
  var target_file = cwd+'/src/bundle/bundle.js'
  res.sendFile(target_file)
})

app.get('/bundle_number.js', (req, res) => {
  var target_file = cwd+'/src/bundle/bundle_number.js'
  res.sendFile(target_file)
})

app.get('/bundle_number_pat.js', (req, res) => {
  var target_file = cwd+'/src/bundle/bundle_number_pat.js'
  res.sendFile(target_file)
})

app.get('/bundle_number_tel.js', (req, res) => {
  var target_file = cwd+'/src/bundle/bundle_tel.js'
  res.sendFile(target_file)
})



app.get('/test', (req, res) => {
  var target_file = cwd+'/src/html/test.html'
  res.sendFile(target_file)
})

app.get('/map', (req, res) => {
  var target_file = cwd+'/src/html/site_map.html'
  res.sendFile(target_file)
})

// check for port env variable for when being deployed from heroku server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port);
