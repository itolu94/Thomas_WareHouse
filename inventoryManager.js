'use strict';

// require mysql and prompt npm
var mysql = require('mysql');
var prompt = require('prompt');

// obtain sql credentials
var credentials = require('./mysql.js');

// connect to our database
var connection = mysql.createConnection(credentials);

var productIdsArray = [];
var productsQuantity = [];

var quantity;


var managerDuty = {
    properties: {
        thingsToDo: {
            type: 'number',
            // maxItems: itinerary,
            //  npm descirption said it will not work
            description: "Type '1' for Products on Sale.  \nType '2' for Low Invetory. \nType '3' Add to Invetory. \n Type '4' for New Product.",
            message: 'Please only enter a number between "1", "2", "3", or "4"',
            require: true
        }
    }
}


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

var quantityOfProduct = {
    properties: {
        quantity: {
            // Need to work on patter here aswell!
            patter: /^\d+$/,
            type: 'number',
            description: 'How much would you like to add to the current stock?',
            message: 'Please enter only numerical characters.',
            required: true
        }
    }
}

var inventoryAddition = {
    properties: {
        name: {
            type: 'string',
            description: "What is the name of the new product?",
            message: 'Please enter a name for the new product',
            require: true
        },
        itemId: {
            type: 'number',
            description: "What is the new product's product ID number?",
            message: 'Please enter a valid number',
            require: true
        },
        department: {
            type: 'string',
            description: "What department does the new product belong to?",
            message: 'Please enter department for the new product',
            require: true
        },
        price: {
            type: 'number',
            description: "What is the price for the new product?",
            message: 'Please enter a price for the new item',
            require: true
        },
        stock: {
            type: 'number',
            description: "How much of the new item do we have in Invetory?",
            message: 'Please enter a valid number',
            require: true
        }
    }
}

function hereToDo() {

    prompt.get(managerDuty, function(err, result) {
        if (err) throw err;
        if (/^[1-5]$/.test(result.thingsToDo)) {
            switch (result.thingsToDo) {
                case 1:

                    forSale();
                    break;
                case 2:

                    lowInventory();
                    break;
                case 3:

                    addToInventory();
                    break;

                case 4:
                    newProduct();
                    break;
            }
        } else {
            console.log(' \n Please enter "1", "2", "3", or "4" \n');
            hereToDo();
        }
    })
}








function forSale() {
    var query = 'SELECT * FROM products';
    connection.query(query, function(err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            console.log('\n ======================================================= \n');
            console.log('  Item ID:  ' + result[i].item_id);
            console.log('  Product:  ' + result[i].product_name);
            console.log('  Department:  ' + result[i].department_name);
            console.log('  Price:  ' + result[i].price);
            console.log('  Quantity in Stock:  ' + result[i].stock);
        };
    })
}


function lowInventory() {
    var query = 'SELECT * FROM products WHERE stock <= 5';
    connection.query(query, function(err, result) {

        for (var i = 0; i <= result.length; i++) {
            if (result.length === 0) {
                console.log('All items are suffciently stocked.')
            } else {
                console.log('\n ======================================================= \n');
                console.log('  Item ID:  ' + result[i].item_id);
                console.log('  Product:  ' + result[i].product_name);
                console.log('  Department:  ' + result[i].department_name);
                console.log('  Quantity in Stock:  ' + result[i].stock);
                console.log(result)
            }
        };
    })
}

// add a new product to the inventory
function newProduct() {
    prompt.get(inventoryAddition, function(err, result) {
        if (err) throw err;
        var query = 'INSERT INTO products SET ?'
        var variables = {
            item_id: result.itemId,
            product_name: result.name,
            department_name: result.department,
            stock: result.stock,
            price: result.price,
            product_sales: 0
        }
        connection.query(query, variables, function(err, result) {
            if (err) throw err;
            console.log('Product was added to the invetory');
        })
    })

}


function addToInventory() {
    var query = 'SELECT * FROM products'
    connection.query(query, function(err, res) {
        // run a loop to display the products in our inventory
        for (var i = 0; i < res.length; i++) {
            console.log('\n ======================================================= \n')
            console.log('  Item ID:  ' + res[i].item_id)
            console.log('  Product:  ' + res[i].product_name)
            console.log('  Price:  ' + res[i].price)
            console.log('  Quantity in Stock:  ' + res[i].stock)
            productIdsArray.push(res[i].item_id);
            productsQuantity.push(res[i].stock);
        }
        startAdding();
    })
}


function startAdding() {
    // start prompt to get user to input the productId
    // for the product they want to update
    prompt.get(productId, function(err, result) {
        if (err) throw err
            // if the id enter matches an item in the inventory
            // we then ask the user how much they want to add to the current stock.
        if (productIdsArray.indexOf(result.purpose) > 0) {
            var reference = productIdsArray.indexOf(result.purpose);
            prompt.get(quantityOfProduct, function(err, result) {
                    quantity = productsQuantity[reference] + result.quantity;
                    if (err) throw err;
                    if (result.quantity > 0) {
                        // determine how to update database
                        var query = 'UPDATE products SET ? WHERE ?';
                        var variables = [{
                            stock: quantity
                        }, {
                            id: (reference + 1)
                        }];
                        connection.query(query, variables, function(err, result) {
                            if (err) throw err
                        })
                    } else {
                        console.log('Not a valid input!');
                    }
                })
                // if the number doesnt match, we call the function again
                // this gives the user a chance to enter the right product id number
        } else {
            console.log('Please enter a valid productID number.')
            startAdding()
        }
    })
}



hereToDo();
