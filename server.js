const express = require('express');
const fs = require('fs');
const fsP = require('fs').promises;
const boards = require('./boards.js');
const http = require('http');

const cwd = __dirname

//const app = express()

function requestCallback(request/* an http.IncomingMessage as per bullets below the event (also HttpServer has no <ImcomingMeesage> property) */, response) {
    let httpServer = this; // (assuming this function we're in is a "ordinary listener function") based on event module
    console.log(this);
    console.log('request url: '+request.url)
    if (request.url === "/") {
        var target_file = cwd+'/src/html/site_map.html';
        response.statusCode=200;
        response.setHeader('Content-Type', 'text/html');
        response.write(fs.readFileSync(target_file), 'utf8');
        response.end();
    }
    if (request.url === "/favicon.ico") {
         var target_file = cwd+'/src/compiled/favicon-2.png'
         response.statusCode = 200;
         response.setHeader('Content-Type', 'image/png');
         response.flushHeaders();
         response.end(fs.readFileSync(target_file), 'utf8');
    }
    else if (request.url === '/game' ){
        var diff = 'easy';
        let randBoardPromise = new Promise( (R, r) => { R(boards.randomBoard(diff))} );
        let filePromise = fsP.readFile('./src/html/game_page.html', 'utf8');
        Promise.all(new Array(randBoardPromise, filePromise)).then(function(results){
                var data=results[1];
                var split_point = data.indexOf('<script src="./bundle.js">');
                var before = data.slice(0, split_point);
                var after = data.slice(split_point);
                data = before+'<script type="text/javascript">var board_string=\''+results[0]+'\'</script>\n'+after;
                response.statusCode=200;
                response.setHeader('Content-Type', 'text/html');
                response.end(data, 'utf8');
        });
    }
}


// check for port env. variable to use when being ran on heroku server
// otherwise run on port 5000 locally
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

//app.listen(port);
http.createServer(requestCallback).listen(port);
