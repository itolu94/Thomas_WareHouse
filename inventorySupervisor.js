'use strict';

// require mysql, terminal table, and prompt npm
var mysql = require('mysql');
var prompt = require('prompt');
var Table = require('terminal-table');
// obtain sql credentials
var credentials = require('./mysql.js');

// connect to our database
var connection = mysql.createConnection(credentials);


var supervisorDuty = {
    properties: {
        thingsToDo: {
            type: 'number',
            description: "Type '1' to view product sales by department.  \nType '2' to create a new department.",
            message: 'Please only enter a number between "1", "2", "3", or "4"',
            require: true
        }
    }
}

var newDepartment = {
    properties: {
        departmentID: {
            type: 'number',
            description: "What is the new departments id number",
            message: 'Please enter a series of numbers that represent the department id',
            require: true
        },
        departmentName: {
            type: 'string',
            description: "What is the name for the new department?",
            require: true
        },
        overHeadCosts: {
            type: 'number',
            description: "What is the over head cost for this department?",
            require: true
        }
    }
}

function hereToDo() {
    prompt.start()
    prompt.get(supervisorDuty, function(err, result) {
        if (/^[1-2]$/.test(result.thingsToDo)) {
            switch (result.thingsToDo) {
                case 1:
                    viewProductSales();
                    break;
                case 2:
                    createNewDepartment();
                    break;
                    s
            }
        } else {
            console.log("Please enter either '1' or '2'. ");
            hereToDo();
        }
    })
}


// Displays table in terminal that shows total profit
function viewProductSales() {

	// Titles for the rows that will be displayed in the terminal
    var namesFR = ['Department ID', 'Department Name', 'Over Head Cost', 'Total Sales', 'Total Profit'];
    
    // create new table
    var productSales = new Table({
        width: ['20%', '20%', '20%', '20%', '20%']
    })
    // query to get information about each department
    var query = 'SELECT * FROM departments';
    connection.query(query, function(err, res) {
        productSales.push(namesFR)

        // for each iteration, we push the department into the productSales table
        // Each push is a new row 
        for (var i = 0; i < res.length; i++) {
            productSales.push([res[i].department_id, res[i].department_name, res[i].over_head_costs,
                res[i].total_sales, (res[i].total_sales - res[i].over_head_costs)
            ])
        }

        // display the table
        console.log('' + productSales)
    });
}


// create new department
function createNewDepartment() {
	prompt.get(newDepartment, function(err, result) {
		var query = 'INSERT INTO departments SET ?'
		connection.query(query, [{
			department_id: result.departmentID,
			department_name: result.departmentName,
			over_head_costs: result.overHeadCosts,
			total_sales: 0
		}], function(err, result){
			if(err) throw err; 
			console.log(result)
		})
	})
}


// starts the terminal program
hereToDo();
