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
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Employees",
            "View Roles",
            "View Departments",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Delete Employee",
            "Delete Role",
            "Delete Department",
            "Update Employee Role",
            "End"
        ]
    })

    .then((answer) => {
        switch (answer.action) {
            case "View Employees":
                viewEmployees();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Delete Employee":
                deleteEmployee();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Delete Department":
                deleteDepartment();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "End":
                end();
                break;
    
            }
        })
}
