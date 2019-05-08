//import required packages
const express = require('express');
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



app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  // NEW CODE
  res.render('index2');
});

//http://127.0.0.1:3000/showdatabases

function showDatabases() {
  
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
        
        console.log("LOOP");

      };
    
  console.log("Sent");
  console.log(databases);
  return databases;
     
  });
    
}

app.post('/showdatabases', function (req, res) {
  
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
        
        console.log("LOOP");

      };
    
  console.log("Sent");
  console.log(databases);
  res.send(databases);
     
  });
  
});

function showErrors(err, html)
{
  //this function is a callback. It is called by render on line 35
  //render wil call this function
  log('something terrible happened. CALL ME PLEASE')
}
/*
//create database
app.get('/createdb', (req, res) => {

    let sql = 'CREATE DATABASE mysqltest';
    db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('database created ...')
    });
});
*/

function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}







//show databases
function showDbase(){

    console.log("works")
    app.get('/showdb', (req, res) => {

        let shwdb = 'SHOW DATABASES';
        db.query(sql, (err, result) => {
          console.log(shwdb);
          res.send('Collecting databases...');
        });
      });
    };


//inistialize server listening on port 3000
app.listen('3000', () => {
  console.log('Server started on port 3000')
});
