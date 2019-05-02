var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["Check inveintory", "Buy"],
                name: "action"
            }
        ])
        .then(answer => {
            if (answer.action === "Check inveintory") {
                showStock();
            }
            else if (answer.action === "Buy") {
                select();
            } else {
                connection.end();
            }

        })
};
function showStock() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].item);
                        }
                        return choiceArray;
                    },
                    message: "Select an item for more information"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item === answer.choice) {
                        chosenItem = results[i];
                        console.log("-------------------------------")
                        console.log(chosenItem.price + " dollars each")
                        console.log(chosenItem.quantity + " in stock");
                    }
                }
                start();
            })
    })
}
function select() {
    inquirer.prompt([
        {
            type: "input",
            message: "What would you like to buy?",
            name: "userOrder",
            validate: function (value) {
                if (isNaN(value) === true) {
                    return true;
                }
                return true;
            }
        },
        {
            type: "input",
            message: "How many do you want?",
            name: "userDemand",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(answer => {
        search1 = answer.userOrder
        search2 = search1.toLowerCase();
        query = "SELECT price, quantity FROM products WHERE ?";
        connection.query(query, { item: search2 }, function (error, results, fields) {
            if (error) throw error;
            for (var i = 0; i < results.length; i++)
                console.log(results[i]);
            let stock = results[0].quantity
            let money = results[0].price
            console.log(stock);
            // console.log(answer.userDemand);
            if (answer.userDemand > stock) {
                console.log("opps, there arent enough " + answer.userOrder + "(s) in stock");
                showStock();
            }
            else {
            updateQ(money, answer.userDemand, stock);
            }
        })
    })
}
function updateQ(money, userDemand, stock) {
    inquirer.prompt([
        {
            message: `that will be ${money * userDemand} dollars`,
            type: "list",
            choices: ["OKAY", "Go back"],
            name: "confirm"
        }
    ]).then(answer => {
        // console.log(search2);
        // console.log(stock)
        if (answer.confirm === "OKAY") {
            console.log("THANK YOU COME AGAIN")
            connection.query(
                "UPDATE products SET quantity = ? WHERE item = ?",
                [`${stock - userDemand}`, `${search2}`],
                function (error, results, fields) {
                    if (error) throw err;
                   start();
                }
            );
        }
        else {
            start();
        }
    })
}
