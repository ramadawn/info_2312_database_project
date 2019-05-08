function showDatabases(){
	//make an ajax call and get status value using the same 'id'
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
						document.getElementById("databaselist").innerHTML += dBaseArray[i]+'<input type="radio" id="'+dBaseArray[i]+'"><br>';
					  }   
					   
				},
				error: function(request,status,errorThrown) {
				// There's been an error, do something with it!
				// Only use status and errorThrown.
				// Chances are request will not have anything in it.
				console.log(errorThrown);
		  }
			});
		
			
		}

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