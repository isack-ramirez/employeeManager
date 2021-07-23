const mysql = require("mysql");
const inquirer = require('inquirer');


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
                    'View All Roles',
                    'View All Departments',


                    'Add Employee',
                    'Add Role',
                    'Add Department',

                    'Remove Employee',
                    'Remove Role',
                    'Remove Department',



                    'Update Employee Role',





                    'done',
                    new inquirer.Separator()
                ]
            }
        ])
        .then((response) => {
            switch (response.funcChoice) {
                case 'View All Employees':

                    viewEmployee();
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


                case 'View All Roles':

                    viewRoles();
                    break;

                case 'Add Role':

                    addRole();
                    break;
                case 'Remove Role':

                    remRole();
                    break;

                case 'View All Departments':

                    viewDepartments();
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




//---------------------------------VIEW METHODS-----------------------------------------------------------------------------------






const viewEmployee = () => {
    console.log('Viewing Employees...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

const viewDepartments = () => {
    console.log('Viewing Departments...\n');
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

const viewRoles = () => {
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

                    init();
                });
        })
}




//-------------------------------------------------------ADD A ROLE--------------------------------------------------------------------------------




const addRole = () => {
    depts = [];

    connection.query(`select * from department`, (err, res) => {
        for (let i = 0; i < res.length; i++) {

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

                });
        })
}



//-----------------------------------------CONNECT----------------------------------------------------------------------------------


connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    init();
})





//-------------------------------------ADD EMPLOYEE----------------------------------------------------------------------------------




const addEmp = () => {


    let = roles = [];

    connection.query(`select * from role`, (err, res) => {
        for (let i = 0; i < res.length; i++) {

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








//-------------------UPDATE EMPLOYEE ROLE--------------------------------------------------------------


const updateEmp = () => {


    chngEmpList = []
    let newRole = [];
    let selectedEmployee;


    connection.query(`select * from employee`, (err, res) => {
        for (let i = 0; i < res.length; i++) {

            chngEmpList.push(res[i].first_name);
        }
    })

    connection.query(`select * from role`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {

            newRole.push(res[i].title);
        }
    })



    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'reconfirm',
                message: 'Are you sure you wish to change a role?'
            },


            {
                type: 'list',
                name: 'selectedEmployee',
                message: 'Which employee do you want to change ',
                choices: chngEmpList
            }
        ])
        .then((response) => {
            selectedEmployee = response.selectedEmployee


            inquirer
                .prompt([

                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'Select their new role',
                        choices: newRole
                    }
                ])
                .then((nextResponse) => {

                    console.log(nextResponse);

                    var sql = `
                    UPDATE employee
                    SET role_id = (SELECT id FROM role WHERE title = "${nextResponse.newRole}")
                    WHERE first_name = "${selectedEmployee}";`


                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("Number of records deleted: " + result.affectedRows);
                        init();



                    });




                });


        })








}