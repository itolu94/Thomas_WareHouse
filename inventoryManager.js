var mysql = require('mysql');

var prompt = require('prompt');



prompt.start()


prompt





function forSale() {
        for (var i = 0; i < res.length; i++) {
            console.log('\n ======================================================= \n')
            console.log('  Item ID:  ' + res[i].item_id)
            console.log('  Product:  ' + res[i].product_name)
            console.log('  Department:  ' + res[i].department_name)
            console.log('  Price:  ' + res[i].price)
            console.log('  Quantity in Stock:  ' + res[i].stock)
        }
    };