const mysql = require("mysql");
const inquirer = require('inquirer');
const cTable = require('console.table');
const ListPrompt = require("inquirer/lib/prompts/list");

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',
    password: 'root',

    database: 'emp_mngr_hw'
});

const init = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "funcChoice",
                choices: [
                    'View All Employees',
                    'View All Employees by Department',
                    'View All Employees by Manager',
                    'Add Employee',
                    'Remove Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'View All Roles',
                    'Add Role',
                    'Remove Role',
                    'View All Departments',
                    'Add Department',
                    'Remove Department',
                    'done',
                    new inquirer.Separator()
                ]
            }
        ])
        .then((response) => {
            switch (response.funcChoice) {
                case 'View All Employees':

                    empView();
                    break;

                case 'View All Employees by Department':

                    empDepView();
                    break;

                case 'View All Employees by Manager':

                    empManView();
                    break;

                case 'Add Employee':

                    addEmp();
                    break;

                case 'Remove Employee':

                    remEmp();
                    break;

                case 'Update Employee Role':

                    updateEmp();
                    break;

                case 'Update Employee Manager':

                    updateEmpMan();
                    break;

                case 'View All Roles':

                    roleView();
                    break;

                case 'Add Role':

                    addRole();
                    break;
                case 'Remove Role':

                    remRole();
                    break;

                case 'View All Departments':

                    depView();
                    break;

                case 'Add Department':

                    addDep();
                    break;

                case 'Remove Department':

                    remDep();
                    break;

                case 'Done':
                    connection.end();
                    break;
            }
        }
        )
}

const empView = () => {
    console.log('Viewing Employees...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

const depView = () => {
    console.log('Viewing Departments...\n');
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

const roleView = () => {
    console.log('Viewing Departments...\n');
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}


//--------------------------------------ADD A DEPARTMENT-------------------------------------------------------------------------------



const addDep = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'depName',
                message: 'What is the Department Name?'
            }
        ])
        .then((response) => {
            console.log('Adding Department...\n');
            connection.query(`INSERT INTO department(name) VALUES('${response.depName}');`
            , (err, res) => {
                if (err) throw err;
                console.log(res);
                init();
            });
        })
}




//-------------------------------------------------------ADD A ROLE--------------------------------------------------------------------------------




const addRole = () => {
    depts = [];
 
    connection.query(`select * from department`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            console.log(res);
            depts.push(res[i].name);
        }
    })



    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the Position?'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary for this position?'
            },
            {
                type: 'list',
                name: 'roleDepName',
                message: 'Which department is this position in?',
                choices: depts
            }
        ])
        .then((response) => {
            console.log('Adding Role...\n');

            connection.query(`INSERT INTO role(title,salary,department_id) VALUES('${response.roleName}','${response.salary}', 
            (SELECT id FROM department WHERE name='${response.roleDepName}'));`
            , (err, res) => {
                if (err) throw err;
                console.log(res);
            });
        })
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    init();
})





//-------------------------------------ADD EMPLOYEE----------------------------------------------------------------------------------




const addEmp = () => {
   

     roles = [];

    connection.query(`select * from role`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            console.log(res);
            roles.push(res[i].title);
        }
    })




    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is this employees first name'
            },
            {
                type: 'input',
                name: 'lastName',
                   message: 'What is the last name of this employee'
            },
            {
                type: 'list',
                name: 'role',
                message: 'Which role does this employee have?',
                choices: roles
            }
        ])

        .then((response) => {
            console.log('Adding employee...\n');

            connection.query(`INSERT INTO employee(first_name,last_name,role_id) VALUES('${response.firstName}','${response.lastName}', 
            (SELECT id FROM role WHERE title='${response.role}'));`
            , (err, res) => {
                if (err) throw err;
                console.log(res);
                init();
            });
        })
}










//-------------------------------------------------REMOVE DEPARTMENT--------------------------------------------------------------------




function remDep() {




    inquirer
        .prompt([
            {
                type: 'input',
                name: 'deleteID',
                message: 'Please enter the ID of the department you wish to delete'
            }
        ])

        .then((response) => {

            var sql = `DELETE FROM department WHERE id = ${response.deleteID}`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
                init();
            });
        });

}


//-------------------------------------------------------------------REMOVE ROLE--------------------------------------------------------------------


function remRole() {




    inquirer
        .prompt([
            {
                type: 'input',
                name: 'deleteID',
                message: 'Please enter the ID of the role you wish to delete'
            }
        ])

        .then((response) => {

            var sql = `DELETE FROM role WHERE id = ${response.deleteID}`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
                init();
            });
        });

}






//------------------------------------------------------REMOVE EMPLOYEE-----------------------------------------------------------------------------------------------






function remEmp() {




    inquirer
        .prompt([
            {
                type: 'input',
                name: 'deleteID',
                message: 'Please enter the ID of the employee you wish to delete'
            }
        ])

        .then((response) => {

            var sql = `DELETE FROM employee WHERE id = ${response.deleteID}`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
                init();
            });
        });

}


