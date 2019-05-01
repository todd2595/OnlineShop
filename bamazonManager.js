var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Panzer19382",
    database: "bamazon"
});

function welcome (){
    inquirer.prompt([
        {
            type:"list",
            message:"What would you like to do?",
            choices:["Veiw Products", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name:"root"
        }
    ]).then(function(answer){
        switch(answer.root){
            case "View Products":
                showProducts();
                break;
            case "View Low Inventory":
                showLow();
                break;
            case "Add to Inventory":
                addStock();
                break;
            case "Add New Product":
                NewItem();
                break;
        }
    })
}

function showProducts(){
    connection.query("SELECT * FROM auctions", function(err, results, feilds){
        if (err) throw err;
    }
}