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
    action()
});

function action() {
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
            case "View Joined Tables":
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

// Add Employee
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

// Add Role
function addRole() {
  inquirer
  .prompt([
    {
      name: "newRole",
      type: "input",
      message: "Role title adding?"
    },
    {
      name: "salary",
      type: "input",
      message: "Role salary adding?"
    },
    {
      name: "depID",
      type: "input",
      message: "Role ID adding?"
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: answer.newRole,
        salary: answer.salary,
        department_id: answer.depID,
      },
      function(err) {
        if (err) throw err;
        console.log("Role added successfully");
        action();
      }
    );
  });
}

// Add Department
function addDepartment() {
  inquirer
  .prompt([
    {
      name: "newDep",
      type: "input",
      message: "Department name adding?"
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: answer.newDep,
      },
      function(err) {
        if (err) throw err;
        console.log("Department added successfully");
        action();
      }
    );
  });
}

// Delete Employee
function deleteEmployee() {
    connection.query("SELECT * FROM employee", function(err, results) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(`${results[i].first_name} ${results[i].last_name}`);
                }
                return choiceArray;
              },
              message: "Which employee would you like to remove?"
            }
          ])
          .then(function(answer) {
                var chosenEmployee;
                for (var i = 0; i < results.length; i++) {
                if (`${results[i].first_name} ${results[i].last_name}` === answer.choice) {
                    chosenEmployee = results[i];
                }
                }
                connection.query(
                    "DELETE FROM employee WHERE ?",
                    [
                    {
                        id: chosenEmployee.id
                    }
                    ],
                    function(err) {
                    if (err) throw err;
                    console.log("Employee removed successfully!");
                    action();
                    }
                );
            });
        });  
}

// Delete Roles
function deleteRole() {
    connection.query("SELECT * FROM role", function(err, results) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].title);
                }
                return choiceArray;
              },
              message: "Which role would you like to remove?"
            }
          ])
          .then(function(answer) {
                var chosenRole;
                for (var i = 0; i < results.length; i++) {
                if (results[i].title === answer.choice) {
                    chosenRole = results[i];
                }
                }
                connection.query(
                    "DELETE FROM role WHERE ?",
                    [
                    {
                        id: chosenRole.id
                    }
                    ],
                    function(err) {
                    if (err) throw err;
                    console.log("Role removed successfully!");
                    action();
                    }
                );
            });
        });  
}

//Delete Department
function deleteDepartment() {
    connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].name);
                }
                return choiceArray;
              },
              message: "Which department would you like to remove?"
            }
          ])
          .then(function(answer) {
                var chosenDep;
                for (var i = 0; i < results.length; i++) {
                if (results[i].name === answer.choice) {
                    chosenDep = results[i];
                }
                }
                connection.query(
                    "DELETE FROM department WHERE ?",
                    [
                    {
                        id: chosenDep.id
                    }
                    ],
                    function(err) {
                    if (err) throw err;
                    console.log("Department removed successfully!");
                    action();
                    }
                );
            });
        });  
}

//Update Employee Role
function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", function(err, results) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(`${results[i].first_name} ${results[i].last_name}`);
              }
              return choiceArray;
            },
            message: "Which employee's role would you like to update?"
          },
          {
            name: "newRole",
            type: "input",
            message: "What is the employee's new role id?"
          }
        ])
        .then(function(answer) {
              var chosenEmployee;
              for (var i = 0; i < results.length; i++) {
              if (`${results[i].first_name} ${results[i].last_name}` === answer.choice) {
                  chosenEmployee = results[i];
              }
              }
              connection.query(
                  "UPDATE employee SET ? WHERE ?",
                  [
                  {
                      role_id: answer.newRole
                  },
                  {
                      id: chosenEmployee.id
                  }
                  ],
                  function(err) {
                  if (err) throw err;
                  console.log("Employee updated successfully!");
                  action();
                  }
              );
          });
      });  
  }

  //End
  function end(err) {
    if (err) throw err
    console.log("Connection ended.")
    connection.end()
}
