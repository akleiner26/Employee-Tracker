var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
var util = require("util");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    database: "employeesDB"
});

const artStr = String.raw `

╭━━━╮╱╱╱╱╱╭╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭━━━━╮╱╱╱╱╱╱╭╮
┃╭━━╯╱╱╱╱╱┃┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱┃╭╮╭╮┃╱╱╱╱╱╱┃┃
┃╰━━┳╮╭┳━━┫┃╭━━┳╮╱╭┳━━┳━━╮╰╯┃┃┣┻┳━━┳━━┫┃╭┳━━┳━╮
┃╭━━┫╰╯┃╭╮┃┃┃╭╮┃┃╱┃┃┃━┫┃━┫╱╱┃┃┃╭┫╭╮┃╭━┫╰╯┫┃━┫╭╯
┃╰━━┫┃┃┃╰╯┃╰┫╰╯┃╰━╯┃┃━┫┃━┫╱╱┃┃┃┃┃╭╮┃╰━┫╭╮┫┃━┫┃
╰━━━┻┻┻┫╭━┻━┻━━┻━╮╭┻━━┻━━╯╱╱╰╯╰╯╰╯╰┻━━┻╯╰┻━━┻╯
╱╱╱╱╱╱╱┃┃╱╱╱╱╱╱╭━╯┃
╱╱╱╱╱╱╱╰╯╱╱╱╱╱╱╰━━╯`;

console.log(artStr);

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function dbQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}

const queryDB = util.promisify(connection.query);


const runSearch = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View Employees By Roles",
                "Add Department",
                "Add Employee",
                "Add Role",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "View All Employees By Department":
                    viewByDepartment();
                    break;


                case "View Employees By Roles":
                    viewRoles();
                    break;


                case "Add Department":
                    addDepartment();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Update Employee Role":
                    updateRole();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}
const query = {
    viewAllEmployees: "SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, department.name AS department FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id",
}

const selectAll = (tableName) => {
    return `SELECT * FROM employeesDB.${tableName}`;
}
const getDepartment = (deptName) => {
    return `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id WHERE department.name = '${deptName}'`
}

const getRole = (roleTitle) => {
    return `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, department.name AS department FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id WHERE role.title = '${roleTitle}'`
}

const viewAllEmployees = async () => {
    let data = await dbQuery(query.viewAllEmployees)
    console.table(data);
    runSearch();
}

const viewByDepartment = async () => {
    dbQuery(selectAll("department"))
        .then(async departments => {
            let departmentArr = departments.map(department => department.name);
            departmentArr.push("Back To Main Menu")
            const answer = await inquirer
                .prompt({
                    name: "department",
                    type: "list",
                    message: "Which Department would you like to view?",
                    choices: departmentArr
                });

            switch (answer.department) {
                case "Back to Main Menu":
                    runSearch();
                    break;

                default:
                    const data = await dbQuery(getDepartment(answer.department))
                    console.table(data);
                    runSearch();
                    break;
            }
        }).catch(console.log)
}

const viewRoles = async () => {
    dbQuery(selectAll("role"))
        .then(async roles => {
            let roleArr = roles.map(role => role.title);
            roleArr.push("Back to Main Menu");
            const answer = await inquirer
                .prompt({
                    name: "roles",
                    type: "list",
                    message: "Which Roles Would You Like To View?",
                    choices: roleArr
                });

            switch (answer.roles) {
                case "Back to Main Menu":
                    runSearch();
                    break;

                default:
                    const data = await dbQuery(getRole(answer.roles));
                    console.table(data);
                    runSearch();
                    break;
            }
        }).catch(console.log);
}

const addEmployee = async () => {
    dbQuery(selectAll("role"))
        .then(roles => {
            let roleArr = roles.map(role => role.title);
            managerArr = [];
            managerIDArr = [];
            let query = "SELECT * FROM employee";
            connection.query(query, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].manager_id === null) {
                        managerArr.push(res[i].first_name + res[i].last_name);
                        managerIDArr.push(res[i].id);
                    }
                }
                const answer = inquirer
                    .prompt([
                        {
                            message: "Please Enter the Employee's First Name",
                            name: "firstName",
                            type: "input"
                        },
                        {
                            message: "Please Enter the Employee's Last Name",
                            name: "lastName",
                            type: "input"
                        },
                        {
                            message: "Please Choose The Employee's Role",
                            type: "list",
                            choices: roleArr,
                            name: "newRole"
                        },
                        {
                            message: "Please Select the Employee's Manager",
                            type: "list",
                            choices: managerArr,
                            name: "managerChoice"
                        }

                    ])
                    .then(function (postName) {
                        var roleID = roleArr.indexOf(postName.newRole) + 1;
                        var managerID = managerIDArr[managerArr.indexOf(postName.managerChoice)];
                        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [postName.firstName, postName.lastName, roleID, managerID], function (err, data) {
                            if (err) throw err;
                            console.log("Your Employee Was Added!");
                            runSearch();
                        })
                    })
            })
        })
}

const addDepartment = () => {
    dbQuery(selectAll("department"))
        .then(departments => {
            let departmentArr = departments.map(department => department.name);
            const answer = inquirer.prompt([
                {
                    message: "Please Enter the name of the department you'd like to add",
                    name: "newDept",
                    type: "input"
                }
            ]).then(function (postDept) {
                var deptID = departmentArr.length + 1;
                connection.query("INSERT INTO department (id, name) VALUES (?,?)", [deptID, postDept.newDept], function (err, data) {
                    if (err) throw err;
                    console.log("Your Department Was Added!");
                    runSearch();
                })
            })
        })
}

const addRole = () => {
    dbQuery(selectAll('department')).then((departments) => {
        const departmentArr = departments.map(({ id, name }) => ({
            name: name,
            id: id,
        }));
        const answer = inquirer
            .prompt([
                {
                    message: "What is the name of the role you'd like to add?",
                    name: 'newName',
                    type: 'input',
                },
                {
                    message: 'What is the salary of this new role?',
                    name: 'newSalary',
                    type: 'input',
                },
                {
                    message: 'What department is this role in?',
                    name: 'deptName',
                    type: 'list',
                    choices: departmentArr,
                },
            ])
            .then(function (postRole) {
                const dept = departmentArr.find(
                    (department) => department.name === postRole.deptName);
                connection.query(
                    'INSERT INTO role (title, salary, department_id) VALUE (?,?,?)',
                    [postRole.newName, postRole.newSalary, dept.id],
                    function (err, data) {
                    if (err) throw err;
                        console.log('Your Role Was Added!');
                         runSearch();
                    }
                );
            });
    });
};

const updateRole = async () => {
    dbQuery(selectAll("role"))
        .then(roles => {
            let roleArr = roles.map(role => role.title);
            employeeArr = [];
            managerArr = [];
            managerIDArr = [];
            let query = "SELECT * FROM employee";
            connection.query(query, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    employeeArr.push(res[i].first_name + " " + res[i].last_name);
                    if (res[i].manager_id === null) {
                        managerArr.push(res[i].first_name + " " + res[i].last_name);
                        managerIDArr.push(res[i].id);
                    }
                }
                const answer = inquirer.prompt([
                    {
                        message: "Which employee's role would you like to edit?",
                        name: "chosenEmployee",
                        type: "list",
                        choices: employeeArr
                    },
                    {
                        message: "What would you like their new role to be?",
                        name: "newRole",
                        type: "list",
                        choices: roleArr
                    },
                    {
                        message: "Who is the employee's new manager?",
                        name: "managerChoice",
                        type: "list",
                        choices: managerArr
                    }
                ]).then(function (postRole) {
                    let newEmployee = postRole.chosenEmployee.split(" ");
                    var employee = {
                        firstName: newEmployee[0],
                        lastName: newEmployee[1]
                    }
                    var roleID = roleArr.indexOf(postRole.newRole) + 1;
                    var managerID = managerIDArr[managerArr.indexOf(postRole.managerChoice)];
                    connection.query("UPDATE employee SET role_id = (?), manager_id = (?) WHERE employee.first_name = ? AND employee.last_name = ?", [roleID, managerID, employee.firstName, employee.lastName]), function (err, data) {
                        if (err) throw err;
                    }
                    console.log("Your Roll was Updated!");
                    runSearch();
                })
            })
        })
}