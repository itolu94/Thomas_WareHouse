'use strict';

// require mysql and prompt npm
var mysql = require('mysql');
var prompt = require('prompt');

// obtain sql credentials
var credentials = require('./mysql.js');

// connect to our database
var connection = mysql.createConnection(credentials);

var inventoryItems = [];

var productIdsArray = [];

var productsQuantity = [];
2

var productReference;


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
function inventory() {

    // empties out all arrays that will be used
    inventoryItems = [];
    productIdsArray = [];
    productsQuantity = [];
    connection.query('SELECT * FROM products', function(err, res) {
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
            console.log('So we got in');
            var reference = productIdsArray.indexOf(result.purpose);
            console.log(reference);
            prompt.get(quantityOfProduct, function(err, result) {
                    if (err) throw err;

                    // if the amount of the item in stock is enough for the requested amount
                    if (inventoryItems[reference].stock >= result.quantity) {
                        console.log('We have enough for your needs!');
                        // determine how to update database
            			connection.query('UPDATE products SET ? WHERE ?', 
            				[{stock: (inventoryItems[reference].stock - result.quantity)
            			}, 
            			{
            				id: (reference)
            			}])
                    } else {
                        console.log('Insufficient quantity!');
                    }
                })
                // if the number doesnt match, we call the function again
                // this gives the user a chance to enter the right product id number
        } else {
            startShopping();
        }


    })
}





// Starts the sql query to display items in the inventory
inventory();
