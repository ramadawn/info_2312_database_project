//import required packages
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

//server instance
const app = express();

//create connection
const db = mysql.createConnection({

    host      : 'localhost',
    user      : 'root',
    password  : 'password',
    //database
});

//connect to db using ES6 anon function
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});


//set view engine
app.set('view engine', 'ejs');
//set directory for css and javascripts
app.use(express.static(__dirname + '/public'));
//import in bodyparser to read json
app.use(bodyParser.json());
//render page
app.get('/', function (req, res) {
  res.render('index');
});

//route for showing databases
app.post('/showdatabases', (req, res) => {
  
  var databases = ",";
  let sql = 'SHOW DATABASES';
  db.query(sql, (err, result) => {
      var len =  result.length;
      for (i = 0; i < len; i++) 
      {
    
        var DbaseName = result[i].Database;
        if (DbaseName == "information_schema" || DbaseName == "mysql" || DbaseName == "performance_schema" || DbaseName == "sys")  
          {
          continue;
          }
    
        DbaseName = DbaseName.concat(",");
        databases = databases.concat(DbaseName);
        

      };
    
  console.log("Sent");
  res.send(databases);
  });
});

function showErrors(err, html)
{
  //this function is a callback. It is called by render on line 35
  //render wil call this function
  log('something terrible happened. CALL ME PLEASE')
}

//route for creating a database
app.post('/addDbase', (req, res) => {
  
  let sql = 'CREATE DATABASE ';
  var dBaseNameString = req.body.command;
  console.log(dBaseNameString);
  
  //create new string
  sql = sql.concat(dBaseNameString);
  
  //send query to database
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('database created ...')
  });
  
});

//route for droping a database
app.post('/dropDbase', (req, res) => {
  
  let sql = 'DROP DATABASE ';
  var dBaseNameString = req.body.command;
  console.log(dBaseNameString);
  
  //create new string
  sql = sql.concat(dBaseNameString);
  
  //send query to database
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('database dropped ...')
  });
  
});


function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}






//inistialize server listening on port 3000
app.listen('3000', () => {
  console.log('Server started on port 3000')
});
