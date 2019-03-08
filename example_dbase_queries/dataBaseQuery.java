/*
Name: Douglas Oak

Student# : Not Available due to post in public repository

Algorithm Description: This program prompts the user for employee information
loads the information into a employee object and then stores that object in an array.

It then iterates through the array and returns SQL query strings that add the employee to a database

I then makes a connection  with a data base and sends off the insert statements


No functions or external packages were used as part of this program

Version: 0.1.0.2

*/


import java.sql.*;
import java.util.*;


class dataBaseQuery {
	
	
	
	public static void main(String[] args) 
	{
		
	//initialize scanner object
			Scanner userInput = new Scanner(System.in);
			//progrm control flag
			boolean end_program = false;
			//Array length
			int numEmployees = 1;
			String outPutString;
			
			
			
		
			//intro msg
			print("Welcome to the New Employees database entry app");
			
			//prompt for number of records
			System.out.print("How many records do you need to create: ");
			numEmployees = userInput.nextInt();
			
			//object pointer array
			employees[] employee_array = new employees[numEmployees];
			
			for(int employee = 0; employee < numEmployees; employee++){
				
				//creates new customer
				employees person =  new employees();   
				
			System.out.println("Record for new employee " + (employee + 1));
				newLine();
				
				
				//prompt for first name
				print("Enter Employee first name");
				person.firstName = userInput.next();
				
				//prompt for last name=
				print("Enter Last Name");
				person.lastName =  userInput.next();
				newLine();
				
				//prompt for salary
				print("Enter salary");
				person.salary = userInput.nextDouble();
				newLine();
				
				//prompt for position
				print("Enter position");
				person.position = userInput.next();
				newLine();
				
				
				
				employee_array[employee] = person;
				
			}
			
			newLine();
			
			//iterate through employees and output SQL query strings
			for( employees member : employee_array){
			
				//create connection msg
				outPutString = "INSERT INTO employee(first_name,last_name,salary,position)VALUES('" + member.firstName + "','" + member.lastName + "'," + member.salary + ",'" + member.position + "');";
				//print connection confirmation
				print("Inserting " + outPutString);				 
				//call connection
				createConnection(outPutString);	
			
			}
	
	
		
	}
	//Function for creating database connection
	static void createConnection(String outPutString)
	{
		
			
		try {
		//load jbdc driver
		Class.forName("com.mysql.cj.jdbc.Driver");
		//make connection
		Connection con = DriverManager.getConnection(
		"jdbc:mysql://localhost:3306/personel","root","root");
		//initialize create statement object
		Statement stmt = con.createStatement(); 
		//output statement msg
		stmt.executeUpdate(outPutString); 
		//close connection
		con.close();
		}
		
		catch (Exception e) {
			
		System.out.println(e);
			
		}
		
	}
	
	public static void print(int input){
		
		System.out.println(input);
		
		
	}
	
	public static void print(double input){
		
		System.out.println(input);
		
		
	}
	
	public static void print(String input){
		
		System.out.println(input);
		
		
	}
	
	public static void newLine(){
	
		System.out.println();
	
	}
	
}

class employees {
	
	String firstName;		  //first name string
	String lastName ;         //Last Name string
	double salary;            //income double
	String position;          //position string
	
}
	
	
