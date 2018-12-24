const express = require('express');
const path = require('path');

const app = express();

const cwd = path.resolve()

var static_files_root_dir = path.resolve() + '/public'
app.use(express.static(static_files_root_dir))

app.get('/', (req, res) => {
	var target_file = cwd+'/src/html/home_page.html'
	res.sendFile(target_file)
})

app.all('/game', (req, res) => {
  var target_file = cwd+'/src/html/game_page.html'
  res.sendFile(target_file)
})

app.get('/bundle.js', (req, res) => {
  var target_file = cwd+'/src/bundle/bundle.js'
  res.sendFile(target_file)
})

// check for port env variable for when being deployed from heroku server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port);





/*
app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.set('Access-Control-Allow-Origin', '*')
  console.log(res.get('Access-Control-Allow-Origin'))

  res.json(customers);
  
});
*/