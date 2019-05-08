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

//connect to selected database
app.post('/connectDbase', (req, res) => {
  
  var dBaseNameString = req.body.name;
  //connect to database
  //create connection
  const db = mysql.createConnection({

  host      : 'localhost',
  user      : 'root',
  password  : 'password',
  database  : dBaseNameString,
    });
    
});

//route for showing database tables
app.post('/showtables', (req, res) => {
  
  var databaseName = req.body.name;
  var tables = [];
  let sql = 'SHOW TABLES FROM ';
  sql = sql.concat(databaseName);
  db.query(sql, (err, result) => {
      var len =  result.length;
      for (i = 0; i < len; i++) 
      {
        
        tables.push(result[i].Tables_in_personel);
       };
    res.send(JSON.stringify(tables));
  });
});

app.post('/showtable', (req,res) => {

  var tablePath = req.body.path;
  var sql = 'Select * FROM ';
  sql = sql.concat(tablePath);
  db.query(sql, (err,result) => {

    result_array=[];
    
    //unpack result
    for(pos in result){
      temp_array = [];
      temp_array = Object.entries(result[pos]);
      //find number of rows
      var rowCount = 0;
      for(place in temp_array){
        rowCount++;
      };
      result_array.push(rowCount);
      //add headers
      for(place in temp_array){
        result_array.push(temp_array[place][0]);
      };
      break;
    };
    //add vales to array
    for(pos in result){
      temp_array = [];
      temp_array = Object.entries(result[pos]);
      //add values
      for(place in temp_array){
        result_array.push(temp_array[place][1]);
        
      };
    };
    
    
    res.send(JSON.stringify(result_array));
    
  });
});


app.post('/loadcsv', (req,res) => {

  //load data
  var data = req.body.data;
  //initiize SQL
  var sql1 = 'CREATE TABLE ';
  //unpack dbase name
  var databaseName = data[data.length - 1];
  // concat dbase name
  sql1 = sql1.concat(databaseName);
  //add period
  sql1 = sql1.concat(".");
  //unpack table name
  var tableName = data[data.length - 2];
   //add table name
   sql1 = sql1.concat(tableName);
   //add open bracket
   sql1 = sql1.concat(" ( ");


  var tableRows = data[0];
  HeaderNames = []
  HeaderDataTypes = [];

  
  
  for(var pos = 1; pos < (2 * tableRows + 1); pos = pos + 2){

            //add header
            sql1 = sql1.concat(data[pos]+" ");
            sql1 = sql1. concat(data[pos+1]+ ", ");


  }

  //cut off last comma
  sql1 = sql1.substring(0,(sql1.length - 2));
  //create insert into command
  sql1 = sql1.concat(" );"); 
  // concat dbase name
  var sql = " INSERT INTO ";
  //sql = sql1.concat(sql);
  sql = sql.concat(databaseName);
  //add period
  sql = sql.concat(".");
  //add table name
  sql = sql.concat(tableName);
  //add open bracket
  sql = sql.concat(" ( ");
 //add headers to insert into command
  for(var pos = 1; pos < (2 * tableRows + 1); pos = pos + 2){

    //add header to insert into statement
    sql = sql.concat(data[pos]+", ");
  }

  //cut off last comma
  sql = sql.substring(0,(sql.length - 2));
  //add closing brackert
  sql = sql.concat(" ) VALUES ");


   for(var datapos = (2 * tableRows + 1); datapos < (data.length - tableRows); datapos = datapos + tableRows){
     
        //start of each row
        
        sql = sql.concat(" (");
        for (var datacolumn = datapos; datacolumn < (datapos + tableRows); datacolumn++){
          
          try {
            var dString = '"';
            var entry = data[datacolumn];
            var dString = dString.concat(entry);
            var dString = dString.concat('"');
            
          }
          catch(err) {
            var dString = data[datacolumn];
          }
              
              sql = sql.concat(dString);
              sql = sql.concat(",");
      
        } 
        sql = sql.substring(0,(sql.length - 1));
        sql = sql.concat(" ),");
      }
      //remove last comma
      sql = sql.substring(0,(sql.length - 1));
      //add semicolon to end
      sql = sql.concat(";");
      //console.log(sql);
    //sql = 'INSERT INTO personel.Titanic ( PassengerId, Pclass, Name, Sex, Age, SibSp, Parch, Ticket, Fare, Cabin, Embarked ) VALUES  ("1272","3","OConnor, Mr. Patrick","male","0","0","366713","7.75","Q","null","null" );';
    
  //transmit the database command
    db.query(sql1, (err,result) => {
      executeQuery2(db, res);
    });
  
    
    
    console.log(result);
  });  
});   

function executeQuery2(db, res) {
  let sql = ""
  db.query(sql, (err2,result2) => {
res.send("done")
  });
}

function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}






//inistialize server listening on port 3000
app.listen('3000', () => {
  console.log('Server started on port 3000')
});
