import express from "express";
const app = express();
const port = 3000;
import { readFile, writeFile } from "./modules/fileHandler.js";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

let employees = [];
(async () => {
  try {
    const data = await readFile("./employees.json", "utf-8");
    employees = JSON.parse(data);
    console.log("Employee data loaded successfully");
  } catch (error) {
    console.error("Error loading employee data:", error);
    employees = [];
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();

app.get("/", (req, res) => {
  res.render("index", { employees });
});

app.get("/employees", (req, res) => {
  res.json(employees);
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  const newEmployee = {
    id: employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    name: req.body.name,
    position: req.body.position,
    department: req.body.department,
    salary: parseFloat(req.body.salary)
  };
  employees.push(newEmployee);
  try {
    await writeFile("./employees.json", JSON.stringify(employees, null, 2));
    res.redirect("/");
  } catch (error) {
    console.error("Error saving employee data:", error);
    res.status(500).send("Error saving employee data");
  }
});

app.get("/edit/:id", (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employee = employees.find((emp) => emp.id === employeeId);
  if (employee) {
    res.render("edit", { employee });
  } else {
    res.status(404).send("Employee not found");
  }
});

app.post("/edit/:id", async (req, res) => {
  const employeeId = parseInt(req.params.id);
  const index = employees.findIndex((emp) => emp.id === employeeId);
  if (index !== -1) {
    employees[index] = {
      id: employeeId,
      name: req.body.name,
      position: req.body.position,
      department: req.body.department,
      salary: parseFloat(req.body.salary)
    };
    try {
      await writeFile("./employees.json", JSON.stringify(employees, null, 2));
      res.redirect("/");
    } catch (error) {
      console.error("Error updating employee data:", error);
      res.status(500).send("Error updating employee data");
    }
  } else {
    res.status(404).send("Employee not found");
  }
});

app.delete("/delete/:id" , async (req, res) => {
  const empId = parseInt(req.params.id);
  const idx = employees.findIndex(emp => emp.id === empId);
  if(idx!==-1){
    employees.splice(idx,1);
    try{
      await writeFile("./employees.json", JSON.stringify(employees, null, 2));
      res.json({message:"Employee deleted successfully"});
    }catch(error){
      console.error("Error deleting employee data:", error);
      res.status(500).json({message:"Error deleting employee data"});
    }
  }
    else{
      res.status(404).json({message:"Employee not found"});
    }
  });
app.get("/employees/:id", (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employee = employees.find((emp) => emp.id === employeeId);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

app.post("/employees", async (req, res) => {
    const newEmployee = req.body;
    newEmployee.id = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    employees.push(newEmployee);
    try {
        await writeFile("./employees.json", JSON.stringify(employees, null, 2));
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("Error saving employee data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});