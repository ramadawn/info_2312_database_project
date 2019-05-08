//import required packages
const express = require('express');
const mysql = require('mysql');



//create connection
//const db = mysql.createConnection({

//    host      : 'localhost',
//    user      : 'root',
//    password  : 'password',
//    //database
//});

//connect to db using ES6 anon function
//db.connect((err) => {
//    if(err){
//        throw err;
//    }
    console.log('MySql Connected...');
//});

//server instance
const app = express();

//app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  // NEW CODE
  res.render('index2');
});
app.get('/DbaseTool/api/showdatabases', function (req, res) {
  // NEW CODE
  //res.render(JSON.stringify(showDatabases()), null, showErrors);
  res.json(showDatabases());
  console.log('It worked!')
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
function showDatabases() {
  var databases = [];
  databases.push('db1');
  return databases;
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
