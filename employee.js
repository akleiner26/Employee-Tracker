var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
var util = require("util");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Phillies35",
    database: "employeesDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

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
                "View All Roles",
                // "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
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


                case "View All Roles":
                    viewRoles();
                    break;


                case "View All Employees By Manager":
                    viewByManager();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Update Employee Role":
                    updateRole();
                    break;

                case "Update Employee Manager":
                    updateManager();
                    break;

                case "exit":
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
    const result = await queryDB(query.viewAllEmployees);
    console.table(result);
    runSearch();
}

const viewByDepartment = () => {
    const departments = await queryDB(selectAll("department"));
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
            const data = await queryDB(getDepartment(answer.department))
            console.table(data);
            runSearch();
            break;
    }

}

const viewRoles = () => {
    const roles = await queryDB(selectAll("role"));
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
            const data = await queryDB(getRole(answer.roles));
            console.table(data);
            runSearch();
            break;
    };
}









// const viewByManager = () => {
//     let managerArr = [];
//    connection.query("SELECT * FROM employeesDB.employee", function (err, employees){
//        employees.forEach = () => {
//            if (employees.manager === null) {
//             managerArr.push(employees.first_name + employees.last_name)
//            }
//        };
//    })
//     inquirer
//         .prompt({
//             name: "byManager",
//             type: "list",
//             message: "Which Manager Would You Like to See?",
//             choices: [
//                 "Sales",
//                 "Engineering",
//                 "Finance",
//                 "Legal",
//                 "Back to Main Menu"
//             ]
// });
// };

// SELECT employee.id AS manager_id, employee.first_name AS manager_first_name, employee.last_name AS manager_last_name, manager.id, manager.first_name, manager.last_name FROM employee inner join employee manager on manager.manager_id = employee.id;
    // inquirer.prompt([
    //     {
    //         message: "Which artist would you like to search for?",
    //         name: "artistName",
    //         type: "input"
    //     }
    // ]).then(function ({ artistName }) {
    //     connection.query("SELECT * FROM top5000 INNER JOIN top_albums ON top5000.artist = top_albums.artist WHERE top5000.year = top_albums.year AND top5000.artist = ?", [artistName], function (err, data) {
    //         if (err)
    //             throw err;

    //         for (let i = 0; i < data.length; i++) {
    //             console.log(
    //                 "Position: " +
    //                 data[i].position +
    //                 " || Song: " +
    //                 data[i].song +
    //                 " || Artist: " +
    //                 data[i].artist +
    //                 " || Year: " +
    //                 data[i].year
    //             );
    //         }

    //         runSearch();
    //     });
    // });



// function artistSearch() {
//     inquirer
//         .prompt({
//             name: "artist",
//             type: "input",
//             message: "What artist would you like to search for?"
//         })
//         .then(function (answer) {
//             var query = "SELECT position, song, year FROM top5000 WHERE ?";
//             connection.query(query, { artist: answer.artist }, function (err, res) {
//                 if (err) throw err;
//                 for (var i = 0; i < res.length; i++) {
//                     console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//                 }
//                 runSearch();
//             });
//         });
// }

// function multiSearch() {
//     var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//     connection.query(query, function (err, res) {
//         if (err) throw err;
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].artist);
//         }
//         runSearch();
//     });
// }

// function rangeSearch() {
//     inquirer
//         .prompt([
//             {
//                 name: "start",
//                 type: "input",
//                 message: "Enter starting position: ",
//                 validate: function (value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             },
//             {
//                 name: "end",
//                 type: "input",
//                 message: "Enter ending position: ",
//                 validate: function (value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             }
//         ])
//         .then(function (answer) {
//             var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//             connection.query(query, [answer.start, answer.end], function (err, res) {
//                 if (err) throw err;
//                 for (var i = 0; i < res.length; i++) {
//                     console.log(
//                         "Position: " +
//                         res[i].position +
//                         " || Song: " +
//                         res[i].song +
//                         " || Artist: " +
//                         res[i].artist +
//                         " || Year: " +
//                         res[i].year
//                     );
//                 }
//                 runSearch();
//             });
//         });
// }

// function songSearch() {
//     inquirer
//         .prompt({
//             name: "song",
//             type: "input",
//             message: "What song would you like to look for?"
//         })
//         .then(function (answer) {
//             console.log(answer.song);
//             connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function (err, res) {
//                 if (err) throw err;
//                 console.log(
//                     "Position: " +
//                     res[0].position +
//                     " || Song: " +
//                     res[0].song +
//                     " || Artist: " +
//                     res[0].artist +
//                     " || Year: " +
//                     res[0].year
//                 );
//                 runSearch();
//             });
//         });
// }