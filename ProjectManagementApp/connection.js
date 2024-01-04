const mysql = require("mysql")
require('dotenv').config();



var connection = mysql.createConnection({
    port: process.env.DS_PORT,
    host: process.env.DS_HOST,
    user: process.env.DS_USERNAME,
    password: process.env.DS_PASSWORD,
    // database:process.env.DB_NAME
})

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
    
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    
    const useDatabaseQuery = `USE ${process.env.DB_NAME};`;
    
    const createTablesQuery = "CREATE TABLE IF NOT EXISTS Users (" +
    "user_id INT AUTO_INCREMENT PRIMARY KEY, " +
    "username VARCHAR(50) NOT NULL , " +
    "email VARCHAR(100) NOT NULL UNIQUE, " +
    "password VARCHAR(100) NOT NULL, " +
    "role varchar(30) NOT NULL,"+
    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
    "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP " +
");";


const createOtpTable = "CREATE TABLE IF NOT EXISTS Otps (" +

"email VARCHAR(100) PRIMARY KEY, " +
"otp VARCHAR(100) NOT NULL, " +
"created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP " +
");";

const createSessionTable = "CREATE TABLE IF NOT EXISTS Session (" +
"user_id INT PRIMARY KEY, " +
"isactive BOOLEAN NOT NULL DEFAULT FALSE " +

");";

 const createProjectTable =  "CREATE TABLE IF NOT EXISTS Projects ("+
 "project_id INT AUTO_INCREMENT PRIMARY KEY,"+
 "project_name VARCHAR(255) NOT NULL,"+
 "description TEXT,"+
 "start_date DATE,"+
 "end_date DATE,"+
 "status VARCHAR(50),"+
 "budget DECIMAL(10,2),"+
 "actual_cost DECIMAL(10,2),"+
 "manager_id INT)"

  
 const createProjectStatusQuery = "CREATE TABLE IF NOT EXISTS ProjectStatus (" +
 "id INT AUTO_INCREMENT PRIMARY KEY, " +
 "project_id INT NOT NULL, " +
 "planning_status INT, " +
 "design_status INT, " +
 "development_status INT, " +
 "testing_status INT, " +
 "overall_completion DECIMAL(5,2), " +
 "comments TEXT, " +
 "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
 "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
 "FOREIGN KEY (project_id) REFERENCES Projects(project_id) " +
");";


    // Create the database
    connection.query(createDatabaseQuery, (err) => {
        if (err) throw err;
        console.log('Database created or already exists!');

        // Use the created database
        connection.query(useDatabaseQuery, (err) => {
            if (err) throw err;

            // Create tables in the database
            connection.query(createTablesQuery, (err) => {
                if (err) throw err;
                else{
                    connection.query(createSessionTable,(err)=>{
                        if(err) throw err;
                        else{ 
                            connection.query(createOtpTable,(err)=>{
                                if(err) throw err;
                                else{ 
                                       connection.query(createProjectTable,(err)=>{
                                        if(err) throw err;
                                        else{

                                            connection.query(createProjectStatusQuery,(err)=>{
                                                if(err)throw err;
                                                else{
                                                    console.log('Tables created or already exist!');

                                                }
                                            })

                                        }
                                       })
                                    
                            }
        
                            })

                    }

                    })
                }
                //c//onnection.end(); // Close the connection
            });
        });
    });

   
});


module.exports = connection;