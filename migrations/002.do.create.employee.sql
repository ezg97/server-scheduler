DROP TABLE IF EXISTS Employee;


CREATE TABLE Employee (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    business_id INTEGER REFERENCES business(id) NOT NULL,
    emp_name TEXT NOT NULL,
    emp_availability TEXT NOT NULL
);


