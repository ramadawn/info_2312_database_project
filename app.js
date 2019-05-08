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
    multipleStatements: true,

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
  var createTable_sql = 'CREATE TABLE ';
  //unpack dbase name
  var databaseName = data[data.length - 1];
  // concat dbase name
  createTable_sql =  createTable_sql.concat(databaseName);
  //add period
  createTable_sql = createTable_sql.concat(".");
  //unpack table name
  var tableName = data[data.length - 2];
   //add table name
   createTable_sql = createTable_sql.concat(tableName);
   //add open bracket
   createTable_sql = createTable_sql.concat(" ( ");


  var tableRows = data[0];
  HeaderNames = []
  HeaderDataTypes = [];

  
  
  for(var pos = 1; pos < (2 * tableRows + 1); pos = pos + 2){

            //add header
            createTable_sql = createTable_sql.concat(data[pos]+" ");
            createTable_sql = createTable_sql. concat(data[pos+1]+ ", ");


  }

  //cut off last comma
  createTable_sql = createTable_sql.substring(0,(createTable_sql.length - 2));
  //create insert into command
  createTable_sql = createTable_sql.concat(" );"); 
  // concat dbase name
  
  //start of insert string
  var Insert_sql = " INSERT INTO "; 
 // Insert_sql = createTable_sql.concat(createTable_sql);
  Insert_sql = Insert_sql.concat(databaseName);
  //add period
  Insert_sql = Insert_sql.concat(".");
  //add table name
  Insert_sql = Insert_sql.concat(tableName);
  //add open bracket
  Insert_sql = Insert_sql.concat(" ( ");
 //add headers to insert into command
  for(var pos = 1; pos < (2 * tableRows + 1); pos = pos + 2){

    //add header to insert into statement
    Insert_sql = Insert_sql.concat(data[pos]+", ");
  }

  //cut off last comma
  Insert_sql = Insert_sql.substring(0,(Insert_sql.length - 2));
  //add closing brackert
  Insert_sql = Insert_sql.concat(" ) VALUES ");


   for(var datapos = (2 * tableRows + 1); datapos < (data.length - tableRows); datapos = datapos + tableRows){
     
        //start of each row
        
        Insert_sql = Insert_sql.concat(" (");
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
              
          Insert_sql = Insert_sql.concat(dString);
          Insert_sql = Insert_sql.concat(",");
      
        } 
        Insert_sql = Insert_sql.substring(0,(Insert_sql.length - 1));
        Insert_sql = Insert_sql.concat(" ),");
      }
      //remove last comma
      Insert_sql = Insert_sql.substring(0,(Insert_sql.length - 1));
      //add semicolon to end
      Insert_sql = Insert_sql.concat(";");
      //console.log(sql);
    //sql = 'INSERT INTO personel.Titanic ( PassengerId, Pclass, Name, Sex, Age, SibSp, Parch, Ticket, Fare, Cabin, Embarked ) VALUES  ("1272","3","OConnor, Mr. Patrick","male","0","0","366713","7.75","Q","null","null" );';
    
  //transmit the database command
    db.query(createTable_sql, (err,result) => {

     
   
    console.log(result);
    //res.send("Table Created...");
    
  });

 // console.log(Insert_sql);
//sleep(50);
  
  
  db.query(Insert_sql, (err2,result2) => {

     
    
    
    console.log(result2);
    res.send("Table Created and Data Loaded...");
    
  });



  



 

  
});


function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}

function executeQuery2(sql, db, res) {
  db.query(sql, (err2,result2) => {
res.send("done")
  });
}






//inistialize server listening on port 3000
app.listen('3000', () => {
  console.log('Server started on port 3000')
});
