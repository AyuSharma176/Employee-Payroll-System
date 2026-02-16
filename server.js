import express from 'express';
const app = express();
const port = 3000;
import {readFile, writeFile} from './modules/fileHandler.js';
let employees=[];

(async () => {
    const data = await readFile('./employees.json', 'utf-8');
    employees = JSON.parse(data);
})();

app.get("/" , ( req, res) => {
    res.send("Welcome to Employee Payroll System");
});

app.get("/employees" , (req,res) =>{
    res.json(employees);
})
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});