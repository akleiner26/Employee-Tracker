USE employeesDB;

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");


INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Doe", 1, 0), ("Michael", "Chan", 2, 1), ("Ryan", "Rodriguez", 3, 0), ("Michael", "Tupik", 4, 3), ("Miguel", "Brown", 5, 0), ("Jared", "Lourd", 6, 0), ("Jodie", "Allen", 7, 6);


Error Code: 1452. Cannot add or update a child row: a foreign key constraint fails (`employeesdb`.`employee`, CONSTRAINT `fk_employee` FOREIGN KEY (`manager_id`) REFERENCES `employee` (`id`) ON DELETE SET NULL)
