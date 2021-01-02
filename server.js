
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "password",
    database: "employee_tracker_db"
  });

  connection.connect(function (err) {
    if (err) throw err;
    init()
});

function init() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View Employees",
            "View Roles",
            "View Department",
            "Add Employee",
            "Add Roles",
            "Add Department",
            "Delete Employee",
            "Delete Roles",
            "Delete Department",
            "Update Employee Role",
            "Exit"
        ]
    })
}