const express = require("express");
const connection = require("../connection");
//const router = express.Router();

const userDetailById = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = "SELECT * FROM Users WHERE user_id = ?;";

    const results = await new Promise((resolve, reject) => {
      connection.query(query, [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    console.log(results);
    res.json({ results, message: "User details fetched successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error querying database");
  }
};



const userDetailByIdParams = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the user ID is passed as a parameter
        const query = "SELECT * FROM Users WHERE user_id = ?;";
  
      const results = await new Promise((resolve, reject) => {
        connection.query(query, [userId], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
  
      console.log(results);
      res.json({ results, message: "User details fetched successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error querying database");
    }
  };

const allUsers = async (req, res) => {
  try {
    const query = "SELECT * FROM Users;"; // Change "Users" to your actual table name

    const results = await new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    console.log(results);
    res.json({ results, message: "All users fetched successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error querying database");
  }
};


const updateUser = async (req, res) => {
    const { username, email, role } = req.body;
    const userId = req.params.id; // Assuming the user ID is passed as a parameter
    console.log(userId);
    
    try {
        const checkQuery = "SELECT * FROM Users WHERE user_id = ?;";
        const updateQuery = "UPDATE Users SET username = ?, email = ?, role = ? WHERE user_id = ?;";
        
        // Check if the user exists
        // const existingUser = await connection.query(checkQuery, [userId]);
        //  console.log(existingUser.length);
        // if (!existingUser.length) {
        //     return res.status(404).send("User not found");
        // }
        connection.query(checkQuery,[userId],(err,result)=>{
            if(err) throw err;
            if(result.length==0)
              return res.status(404).send("User not found");

              
        })

        // Update user information using Promise-based approach
        await new Promise((resolve, reject) => {
            connection.query(updateQuery, [username, email, role, userId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        res.status(200).send("User updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating user");
    }
};

const deleteUser = async (req, res) => {
    const  project_id  = req.params.id;
    console.log(project_id);
  
    const query = "DELETE FROM Users WHERE user_id = ?";
  
    try {
      await deleteUserQuery(query, [project_id]);
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting project");
    }
  };
  
  const deleteUserQuery = (query, values) => {
    return new Promise((resolve, reject) => {
      connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
  


module.exports = { userDetailById, allUsers ,updateUser ,userDetailByIdParams ,deleteUser};
