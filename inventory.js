// 'use strict';

// require mysql and prompt npm
var mysql = require('mysql');
var prompt = require('prompt');

// obtain sql credentials
var credentials = require('./mysql.js');

// connect to our database
var connection = mysql.createConnection(credentials);

// holds the object for each product returned from SELECT * FROM products table
var inventoryItems = [];

// Holds the productId for every row in products table
var productIdsArray = [];

// holds the quantity of each product in the products table
var productsQuantity = [];


// prompt to determine the item the user wants to check out
var productId = {
    properties: {
        purpose: {
            // Need to work on patter
            patter: /^\d+$/,
            type: 'number',
            description: 'Please enter the product ID number for the item that you want.',
            message: 'Please enter a valid product ID number',
            required: true
        }
    }
}

// determines how many of the item choosen the user wants
var quantityOfProduct = {
    properties: {
        quantity: {
            // Need to work on patter here aswell!
            patter: /^\d+$/,
            type: 'number',
            description: 'How many would you like?',
            message: 'Please enter only numerical characters.',
            required: true
        }
    }
}


// Get a list of all the items in inventory
// gets called first
function inventory() {

    // empties out all arrays that will be used
    inventoryItems = [];
    productIdsArray = [];
    productsQuantity = [];
    var query = 'SELECT * FROM products';
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('\n ======================================================= \n')
            console.log('  Item ID:  ' + res[i].item_id)
            console.log('  Product:  ' + res[i].product_name)
            console.log('  Department:  ' + res[i].department_name)
            console.log('  Price:  ' + res[i].price)
            console.log('  Quantity in Stock:  ' + res[i].stock)

            // push productIds of each item into an array
            productIdsArray.push(res[i].item_id)

            // push each objectinto an arrary
            inventoryItems.push(res[i]);
        }
        startShopping();
    })
}

function startShopping() {
    prompt.start();
    prompt.get(productId, function(err, result) {
        if (err) throw err;
        // if the id enter matches an item in the inventory
        if (productIdsArray.indexOf(result.purpose) > 0) {
            var reference = productIdsArray.indexOf(result.purpose);

            // run second prompt to get the quantity needed
            prompt.get(quantityOfProduct, function(err, result) {
                if (err) throw err;
                var product = inventoryItems[reference];
                var sales = product.price * result.quantity;
                // if the amount of the item in stock is enough for the requested amount
                if (product.stock >= result.quantity) {
                    console.log('We have enough for your needs!');
                    console.log('Your total today was $' + sales)

                    // determine how to update databases
                    // console.log(product.stock, result.quantity);
                    var query = 'UPDATE products SET ? WHERE ?';
                    var variables = [{
                        stock: (product.stock - result.quantity),
                        product_sales: (product.product_sales + sales)
                    }, {
                        item_id: product.item_id
                    }];
                    connection.query(query, variables, function(err, result) {
                            if (err) throw err;
                        })

                        // run second query to update departments table
                    var query = 'SELECT * FROM departments';
                    connection.query(query, function(err, result) {
                        // run a loop on the results to find the object row that matches the               
                        for (var i = 0; i < result.length; i++) {
                            if (product.department_name === result[i].department_name) {
                                reference = i;
                                var query = 'UPDATE departments SET ? WHERE ?';
                                var variables = [{
                                    total_sales: (result[reference].total_sales + sales)
                                }, {
                                    department_name: result[reference].department_name
                                }]
                                connection.query(query, variables , function(err, result) {
                                    if (err) throw err;
                                })
                                break;
                            }
                        }
                    })
                } else {
                    console.log('Insufficient quantity!');
                }
            })
        }
        // if the number doesnt match, we call the function again
        // this gives the user a chance to enter the right product id number
        else {
            startShopping();
        }


    })
}





// Starts the sql query to display items in the inventory
inventory();
