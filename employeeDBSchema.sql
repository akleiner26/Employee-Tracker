DROP DATABASE IF EXISTS employeesDB;
CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);


CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(20,2),
    department_id INT(10), 
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY(id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT(10),
    manager_id INT(10),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL,
    PRIMARY KEY (id)
)

