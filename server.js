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
            "View joined tables", 
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

    .then(function(answer) {
        switch (answer.action) {
            case "View joined tables":
          viewJoined();
                break;
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

function viewJoined() {
    connection.query("SELECT role.title, role.salary, employee.first_name, employee.last_name, manager_id, department.name FROM ((employee_tracker_db.role INNER JOIN employee_tracker_db.employee ON role.id = employee.role_id) INNER JOIN employee_tracker_db.department ON role.department_id = department.id)", (err, results) => {
        if (err) throw err
        console.table(results)
        action()
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err
        console.table(results)
        action()
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", (err, results) => {
        if (err) throw err
        console.table(results)
        action()
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err
        console.table(results)
        action()
    })
}

function addEmployee() {
  inquirer
  .prompt([
    {
      name: "fName",
      type: "input",
      message: "First name of employee?"
    },
    {
      name: "lName",
      type: "input",
      message: "Last name of employee?"
    },
    {
      name: "roleID",
      type: "input",
      message: "Employee ID?"
    },
    {
      name: "manID",
      type: "input",
      message: "Manager ID for the employee?"
    },
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: answer.fName,
        last_name: answer.lName,
        role_id: answer.roleID,
        manager_id: answer.manID,
      },
      function(err) {
        if (err) throw err;
        console.log("Employee added successfully");
        action();
      }
    );
  });
}