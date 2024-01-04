const express = require("express");
const connection = require("../connection");



const allManager = async (req, res) => {
    try {
      const query = 'SELECT user_id, username FROM Users WHERE role = ?';
      const results = await queryDatabase(query, ['manager']);
      res.json(results);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users');
    }
  };
  
  // Function to execute SQL queries with async/await
  const queryDatabase = (sql, values) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

  const  myProjects =   async (req, res) => {
    try {

        // const id  = req.body.id
        const id = req.user.id;

      const query = 'SELECT * FROM Projects WHERE manager_id = ?';
      const results = await queryDatabase(query, [id]);
      res.json(results);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users');
    }
  };




const managerProjectBrief = async (req, res) => {
    const id = req.user.id;


    let briefDetail = {
      TotalProjects: "",
      ActiveProjects: "",
      CompletedProjects: "",
      TotalManagers: "",
    };
  
    try {
      const totalProjectsQuery =
        `SELECT COUNT(*) AS total_projects FROM Projects WHERE manager_id = ${id}`;
      const activeProjectsQuery =
        `SELECT COUNT(*) AS active_projects FROM Projects WHERE status = "active" and manager_id= ${id}`;
      const completedProjectsQuery =
        `SELECT COUNT(*) AS completed_projects FROM Projects WHERE status = "completed" and manager_id= ${id}`;
      const totalManagersQuery =
        `SELECT COUNT(DISTINCT manager_id) AS total_managers FROM Projects ` ;
  
      const totalProjects = await queryDb(totalProjectsQuery);
     // console.log("Total projects:", totalProjects[0].total_projects);
      briefDetail.TotalProjects = totalProjects[0].total_projects;
  
      const activeProjects = await queryDb(activeProjectsQuery);
      //console.log("Active projects:", activeProjects[0].active_projects);
      briefDetail.ActiveProjects = activeProjects[0].active_projects;
  
      const completedProjects = await queryDb(completedProjectsQuery);
      //console.log("Completed projects:", completedProjects[0].completed_projects);
      briefDetail.CompletedProjects = completedProjects[0].completed_projects;
  
      const totalManagers = await queryDb(totalManagersQuery);
      //console.log("Total managers:", totalManagers[0].total_managers);
      briefDetail.TotalManagers = totalManagers[0].total_managers;
  
      res.json({ briefDetail });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching project details");
    }
  };
  
  const queryDb = (query) => {
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
  

  module.exports = {allManager,myProjects,managerProjectBrief};