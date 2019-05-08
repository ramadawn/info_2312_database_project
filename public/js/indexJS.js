//displays all databases avaialbe
function showDatabases(){
	//make an ajax call and get status value using the same 'id'
	var dbaseNameArray = [];	
	var dBaseStringList;
		$.ajax({
	
				type:"POST",
				//data
				url:'/showdatabases',
				//can send multipledata like {data1:var1,data2:var2,data3:var3
				//can use dataType:'text/html' or 'json' if response type expected 
				success:function(ajax_dBaseStringList){
					  // process on data
					  dBaseStringList = ajax_dBaseStringList;
					  var dBaseArray = dBaseStringList.split(',');
					  document.getElementById("databaselist").innerHTML = "<h2>Current Databases</h2>";
					  for(i = 0; i < dBaseArray.length; i++){
						if (dBaseArray[i].length == 0) continue;
						document.getElementById("databaselist").innerHTML += dBaseArray[i]+'<input type="radio" id="'+dBaseArray[i]+'" name="dbase"><br>';
						dbaseNameArray.push(dBaseArray[i]);
					  }   
					document.getElementById("dbaseNamearray").value =  dbaseNameArray;
				},
				error: function(request,status,errorThrown) {
				// There's been an error, do something with it!
				// Only use status and errorThrown.
				// Chances are request will not have anything in it.
				console.log(errorThrown);
		  }
			});
		
		make_visible("Show_Tables_Button");
			
		}

//uses Dbasename text box to create a new database
function addDBase(){

			var dbasename = document.getElementById("DbaseName").value;
			$.ajax({
			
				type:"POST",
				contentType: 'application/json',
				data: JSON.stringify( { command: dbasename}),
				url:'/addDbase',
				
				success:function(ajax_dBaseStringList){
					  document.getElementById('msg').innerHTML = "DataBase "+dbasename+" Created";
				},
				error: function(request,status,errorThrown) {
				
				console.log(errorThrown);
		  }
			});
		
			showDatabases();
		}

//uses Dbasename text box to drop a database
function dropDBase(){

			
			var dbasename = document.getElementById("DbaseName").value;
			if (dbasename.length == 0) dbasename = "default";

			$.ajax({
			
				type:"POST",
				contentType: 'application/json',
				data: JSON.stringify( { command: dbasename}),
				url:'/dropDbase',
				
				success:function(ajax_dBaseStringList){
					document.getElementById('msg').innerHTML = "DataBase "+dbasename+" Dropped";
				},
				error: function(request,status,errorThrown) {
				
				console.log(errorThrown);
		  }
			});
		
			showDatabases()
		}


//make connect database button visible
function make_visible(id){

	document.getElementById(id).style.visibility = "visible";
}

//function for connecting to DB as selected by radio buttons
function connectDB(){

	var selectedName = ""; //name of db selected
	//load db name string stored on page
	var dbaseNames = document.getElementById("dbaseNamearray").value;
	//initialize dbname array
	var dbaseNameArray = [];
	//load name string into name array comma delimeted
	dbaseNameArray = dbaseNames.split(",");
	//iterate through array figure out which button is selected
	for (var dbasePos in dbaseNameArray){
		//load selected flag for each id="dbase name"
		var selected = document.getElementById(dbaseNameArray[dbasePos]).checked;
		//if flag is true save name to selectedName variable
		if(selected == true){
			selectedName = dbaseNameArray[dbasePos];
			break;
		}
	}
	//send request to connect to that database
	$.ajax({
			
		type:"POST",
		contentType: 'application/json',
		data: JSON.stringify( { name: selectedName}),
		url:'/connectDbase',
		
		success:function(ajax_dBaseStringList){
			document.getElementById('msg').innerHTML = "Connected To "+selectedName+" ....";
		},
		error: function(request,status,errorThrown) {
		
		console.log(errorThrown);
  }
	});
	//make show tables button visible
	
}

function showTables(){

	//Find database name
	var selectedName = ""; //name of db selected
	//load db name string stored on page
	var dbaseNames = document.getElementById("dbaseNamearray").value;
	//initialize dbname array
	var dbaseNameArray = [];
	//load name string into name array comma delimeted
	dbaseNameArray = dbaseNames.split(",");
	//iterate through array figure out which button is selected
	for (var dbasePos in dbaseNameArray){
		//load selected flag for each id="dbase name"
		var selected = document.getElementById(dbaseNameArray[dbasePos]).checked;
		//if flag is true save name to selectedName variable
		if(selected == true){
			selectedName = dbaseNameArray[dbasePos];
			break;
		}
	}
	
	
	//make an ajax call and get status value using the same 'id'
	var tableNameArray = [];	
	var tableStringList;
	//send database name get back array of tables
	$.ajax({
			
		type:"POST",
		contentType: 'application/json',
		data: JSON.stringify( { name: selectedName}),
		url:'/showtables',
		
		success:function(JSONtablesList){
			tableNameArray = JSON.parse(JSONtablesList);
			//display list of tables
			document.getElementById("tablelist").innerHTML = '<h2>Tables</h2>';
			for(i = 0; i < tableNameArray.length; i++){
				if (tableNameArray[i].length == 0) continue;
				document.getElementById("tablelist").innerHTML += tableNameArray[i]+'<input type="radio" id="'+tableNameArray[i]+'" name="table"><br>';
			  }   
			document.getElementById("tableNamearray").value =  tableNameArray;

		},
		error: function(request,status,errorThrown) {
		
				console.log(errorThrown);
                      }
	    });
		make_visible("showTable");
}

function displayTable(){

	//Find database name
	var tablePath = ""; //name for path
	var dbasename = ""; //name of database to send
	var tableName = ""; //name of table to send
	//load db name string stored on page
	var dbaseNames = document.getElementById("dbaseNamearray").value;
	//load table list string
	var tableNames = document.getElementById("tableNamearray").value;
	//initialize dbname array
	var dbaseNameArray = [];
	//initialize tables array
	tableInfoArray = [];
	//load dbase name string into dbase name array comma delimeted
	dbaseNameArray = dbaseNames.split(",");
	//load table name string into table name array comma delimited
	tableNameArray = tableNames.split(",");
	
	//iterate through arrays figure out which button is selected
	for (var dbasePos in dbaseNameArray){
		//load selected flag for each id="dbase name"
		var selected = document.getElementById(dbaseNameArray[dbasePos]).checked;
		//if flag is true save name to selectedName variable
		if(selected == true){
			dbasename = dbaseNameArray[dbasePos];
			break;
		}
	}

	for (var tablePos in tableNameArray){
		//load selected flag for each id="table name"
		var selected = document.getElementById(tableNameArray[tablePos]).checked;
		//if flag is true save name to selectedName variable
		if(selected == true){
			tableName = tableNameArray[tablePos];
			break;
		}
	}

	tablePath = tablePath.concat(dbasename);
	tablePath = tablePath.concat(".");
	tablePath = tablePath.concat(tableName);
	
	//ajax request
	$.ajax({
			
		type:"POST",
		contentType: 'application/json',
		data: JSON.stringify( { path: tablePath}),
		url:'/showtable',
		
		success:function(JSONTableINFO){
			tableInfoArray = JSON.parse(JSONTableINFO);
			var tablecolumnNumber = tableInfoArray[0];
			var tableDisplay = "";
			tableDisplay = tableDisplay.concat('<table>');
			for(var row = 1; row < tableInfoArray.length;){
				tableDisplay = tableDisplay.concat('<tr>');
				for(var column = 0; column < tablecolumnNumber; column++){
					tableDisplay = tableDisplay.concat("<td>",tableInfoArray[row],"</td>");
					row++;
				}
				tableDisplay = tableDisplay.concat('<tr>');
			}
			tableDisplay = tableDisplay.concat('</table>');
			document.getElementById("Table_Display").innerHTML = tableDisplay;
		},
		error: function(request,status,errorThrown) {
		
				console.log(errorThrown);
                      }
	    });



}

//function for loading "Load CSV and Create Table" selected file
function loadcsv(){


	const FInput = document.getElementById("csvFile").files[0];
	const reader = new FileReader();
	fileArray = [];
	
	//write to the "show tables button" div File loaded can create new button for displaying 
	//table creation UI
	document.getElementById("UIButton").innerHTML = FInput.name + '&nbsp;&nbsp;loaded<br><input type="button" value="Display Table Creation UI" onClick="TCUI()">';
	
	reader.onload = () => {
		
		processCSV(reader.result, fileArray);

	}

	reader.readAsText(FInput)
	
	
	
	
	
}

//function for processing text in a csv array
function processCSV(csv, fileArray) {
	var allTextLines = csv.split(/\r\n|\n/);
	for (var i=0; i<allTextLines.length; i++) {
			var data = allTextLines[i].split(';');
					var tarr = [];
					for (var j=0; j<data.length; j++) {
							tarr.push(data[j]);
					}
					fileArray.push(tarr);
	}
	document.getElementById("csvfiledata").value = JSON.stringify(fileArray);
}

//function for diplaying the table creation matrix
function TCUI(){
	//array to load JSON string saved to page
	TableCreationArray = [];
	//array for TableCreationArray[0] string
	firstRow = [];
	//array for TableCreationArray[1] string
	secondRow = [];
	//load JSON sting on page at csvfiledata and parse it into an array
	TableCreationArray = JSON.parse(document.getElementById("csvfiledata").value);
	//stringfy objects TableCreationArray 0 and 1 into string
	var Row1String =  JSON.stringify(TableCreationArray[0]);
	var Row2String =  JSON.stringify(TableCreationArray[1]);
	//clean string by cutting off first 2 and last 2 positions
	Row1String = Row1String.substring(2,Row1String.length - 2);
	Row2String = Row2String.substring(2,Row2String.length - 2);
  Row2String = Row2String.replace(/\\/g,"");
	console.log(Row1String);


	//split string and create array ignore any commas between ""
	firstRow = Row1String.split(',');
	secondRow = [].concat.apply([], Row2String.split('"').map(function(v,i){
							return i%2 ? v : v.split(',')
 							})).filter(Boolean);
	
	//string for displaying HTML
	displayString = "";
	
	displayString = displayString.concat('<h3>CSV Columns</h3><h4>Table Name<input type="text" id="loadTname"><br><br>');

	//flag indicates whether "no header radio button is checked"
	var firstRowHeaderFlag = document.getElementById("csv").checked;

	//if true fill in header names in coloumn name boxes
	if(firstRowHeaderFlag == true){
	
		for (var column=0; column< firstRow.length; column++){

			displayString = displayString.concat('Column Name<input type="text" id="TC'+column+'Pos0" value="'+firstRow[column]+'">First Entry<input type="text" value="'+secondRow[column]+'"><br>DATATYPE :<input type="radio" id="TC'+column+'Pos1" name="Col'+column+'"> Primary Key<input type="radio" id="TC'+column+'Pos2" name="Col'+column+'"> String<input type="radio" id="TC'+column+'Pos3" name="Col'+column+'"> Number<input type="radio" id="TC'+column+'Pos4" name="Col'+column+'"> Deleate</br>');	 

		}
	}
 //else leave them blank
	else {

		for (var column=0; column< firstRow.length; column++){
			displayString = displayString.concat('Column Name<input type="text" id="TC'+column+'Pos0" value="">First Entry<input type="text" value="'+firstRow[column]+'"><br>DATATYPE :<input type="radio" id="TC'+column+'Pos1" name="Col'+column+'"> Primary Key<input type="radio" id="TC'+column+'Pos2" name="Col'+column+'"> String<input type="radio" id="TC'+column+'Pos3" name="Col'+column+'"> Number<input type="radio" id="TC'+column+'Pos4" name="Col'+column+'"> Deleate</br>');
		}
	}

	document.getElementById("Load_Table").innerHTML = displayString
	//create Load CSV into database button
	document.getElementById("Load_CSV").innerHTML = '<input type="button" value="Load CSV into Database" onClick="UploadToDB()">';

}

function clean_row(string){



}

//function for uploading csv to database
function UploadToDB(){

		//final database array
		dBaseUploadArray = [];

		//array to load JSON string saved to page
		RawDataArray = [];

		//array for each csv row
		lineArray = [];

		//data seelction guidence array
		dataSelectionGuidenceArray = [];


		//load JSON sting on page at csvfiledata and parse it into an array
		RawDataArray = JSON.parse(document.getElementById("csvfiledata").value);
		//stringfy objects TableCreationArray 0 and 1 into string
		var RowString =  JSON.stringify(RawDataArray[0]);

		//clean string by cutting off first 2 and last 2 positions
		RowString = RowString.substring(2,RowString.length - 2);
		RowString = RowString.replace(/\\/g,"");

		//split string and create array ignore any commas between ""
		lineArray = [].concat.apply([], RowString.split('"').map(function(v,i)
						{
						return i%2 ? v : v.split(',')
						 })).filter(Boolean);

		//indicates number column fields to iterate through
		var dBNumColumnsRaw = lineArray.length;

		//iterate through page lines
		for (var column = 0; column < dBNumColumnsRaw; column++){
						//Is the deleate radio button selected
						var Dontkeepfield = document.getElementById("TC"+column+"Pos4").checked;

						if(Dontkeepfield==true){
				
							continue;

						}

						else{

							dataSelectionGuidenceArray.push(column);
						}

					}

		//actual number of columns to be uploaded
		var actualSize = dataSelectionGuidenceArray.length;
		//load number of actual columns to the upload array
		dBaseUploadArray.push(actualSize);

		//load headers
		for (var column = 0; column < actualSize; column++){
				//use giudence array to load headers in by position
				var header = document.getElementById("TC"+dataSelectionGuidenceArray[column]+"Pos0").value

				if (document.getElementById('TC'+column+'Pos1').checked == true){
							var headerDType = "INT PRIMARY KEY";
				}

				else if (document.getElementById('TC'+column+'Pos3').checked == true){
							var headerDType = "DOUBLE";
				}

				else {var headerDType = "VARCHAR(100)";}
				
				
				dBaseUploadArray.push(header);
				dBaseUploadArray.push(headerDType);

				
			}
		
		
		for (var row = actualSize + 1; row < (RawDataArray.length -1); row++){

					lineArray = [];
					var RowString =  JSON.stringify(RawDataArray[row]);
					//clean string by cutting off first 2 and last 2 positions
					RowString = RowString.substring(2,RowString.length - 2);
					RowString = RowString.replace(/\\/g,"");
					//split string and create array ignore any commas between ""
					lineArray = [].concat.apply([], RowString.split('"').map(function(v,i)
										{
										return i%2 ? v : v.split(',')
										 })).filter(Boolean);
			
					for (var column = 0; column < actualSize; column++){
								
								
								var data = lineArray[dataSelectionGuidenceArray[column]];
								//use giudence array to load headers in by position
								dBaseUploadArray.push(data);
				
							}

				}
				//load name of table and push to end of dBaseUploadArray
				dBaseUploadArray.push(document.getElementById("loadTname").value);
				//load up dbase array list
				var dbasearraystring = document.getElementById("dbaseNamearray").value;
				tempdbaseArray = [];
				//load database names into array
				tempdbaseArray = dbasearraystring.split(',');
				var dbaseName = "";
				//iterate through list of databases find the one that is checked and assign 
        //that name to the database variable
				for(var dbase = 0; dbase < tempdbaseArray.length; dbase++){

								if(document.getElementById(tempdbaseArray[dbase]).checked == true){
												dbaseName = tempdbaseArray[dbase];
												break;
								}
				
				}

				dBaseUploadArray.push(dbaseName);


				//ajax call
				$.ajax({
			
					type:"POST",
					contentType: 'application/json',
					data: JSON.stringify( { data: dBaseUploadArray}),
					url:'/loadcsv',
					
					success:function(JSONTableINFO){
					
								document.getElementById("msg").innerHTML = "File Loaded into database"
								showTables();
					},
					error: function(request,status,errorThrown) {
					
							console.log(errorThrown);
														}
						});
			

				



}

