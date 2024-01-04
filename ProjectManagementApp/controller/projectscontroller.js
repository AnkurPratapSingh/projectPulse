const express = require("express");
const connection = require("../connection");

const addProject = async (req, res) => {
  const {
    project_name,
    description,
    start_date,
    end_date,
    status,
    budget,
    actual_cost,
    manager_id,
  } = req.body;

  const query = "INSERT INTO Projects (project_name, description, start_date, end_date, status, budget, actual_cost, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    await insertProject(query, [
      project_name,
      description,
      start_date,
      end_date,
      status,
      budget,
      actual_cost,
      manager_id,
    ]);
    res.status(200).json({ message: "Project added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding project");
  }
};


const updateProject = async (req, res) => {
  const {
    project_id,
    project_name,
    description,
    start_date,
    end_date,
    status,
    budget,
    actual_cost,
    manager_id,
  } = req.body;

  const query =
    "UPDATE Projects SET project_name = ?, description = ?, start_date = ?, end_date = ?, status = ?, budget = ?, actual_cost = ?, manager_id = ? WHERE project_id = ?";

  try {
    await updateProjectQuery(query, [
      project_name,
      description,
      start_date,
      end_date,
      status,
      budget,
      actual_cost,
      manager_id,
      project_id,
    ]);
    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating project");
  }
};

const updateProjectQuery = (query, values) => {
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
const insertProject = (query, values) => {
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

const projectDetailsBrief = async (req, res) => {
  let briefDetail = {
    TotalProjects: "",
    ActiveProjects: "",
    CompletedProjects: "",
    TotalManagers: "",
  };

  try {
    const totalProjectsQuery =
      "SELECT COUNT(*) AS total_projects FROM Projects";
    const activeProjectsQuery =
      'SELECT COUNT(*) AS active_projects FROM Projects WHERE status = "active"';
    const completedProjectsQuery =
      'SELECT COUNT(*) AS completed_projects FROM Projects WHERE status = "completed"';
    const totalManagersQuery =
      "SELECT COUNT(DISTINCT manager_id) AS total_managers FROM Projects";

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

const allProjectDetail =async (req,res)=>{
   try{
            const query =        'SELECT * FROM Projects';
            const allDetails = await queryDb(query);
            res.json({allDetails})



   }
   catch(error){
    console.error(error);
    res.status(500).send("Error fetching project details");

   }
}

const projectDetailById = async (req,res)=>{
  try{
             const id = req.params.id;
           const query =        'SELECT * FROM Projects where project_id = ? ';
           const allDetails = await getDetail(query,[id]);
           res.json({allDetails})



  }
  catch(error){
   console.error(error);
   res.status(500).send("Error fetching project details");

  }
}
const getDetail = (query, values) => {
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



const deleteProject = async (req, res) => {
  const  project_id  = req.params.id;
  console.log(project_id);

  const query = "DELETE FROM Projects WHERE project_id = ?";

  try {
    await deleteProjectQuery(query, [project_id]);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting project");
  }
};

const deleteProjectQuery = (query, values) => {
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





const projectStatus = async(req,res)=>{

const projectStatusQuery = 'Select * from ProjectStatus where manager_id '
  const totalProjects = await queryDb(totalProjectsQuery);


}

// Fetch number of active projects

// Fetch number of completed projects
// connection.query('SELECT COUNT(*) AS completed_projects FROM Projects WHERE status = "completed"', (error, results) => {
//   if (error) throw error;
//   console.log('Completed projects:', results[0].completed_projects);
// });

// Fetch total number of managers
// connection.query('SELECT COUNT(DISTINCT manager_id) AS total_managers FROM Projects', (error, results) => {
//   if (error) throw error;
//   console.log('Total managers:', results[0].total_managers);
// });

module.exports = { addProject, updateProject ,projectDetailsBrief ,allProjectDetail,projectDetailById ,deleteProject,projectStatus};
