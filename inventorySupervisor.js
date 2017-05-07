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

function viewProductSales() {
    // create new table
    var namesFR = ['Department ID','Department Name','Over Head Cost','Total Sales', 'Total Profit'];
    var departments = [];
    var productSales = new Table({
    	width: ['20%','20%','20%','20%', '20%']
    })
    connection.query('SELECT * FROM departments', function(err, res) {
    	productSales.push(namesFR)
        for (var i = 0; i < res.length; i++) {
			productSales.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, 
				res[i].total_sales, (res[i].total_sales - res[i].over_head_costs)])
        }
            console.log('' + productSales)
   			console.log('hello')
    });

}



hereToDo();
