const { Employees } = require('../models');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const xlsx = require('xlsx');


const sendEmailHandler = require('../util/sendEmail')


const getAllEmployee = async (req, res) => {
    try {
        const emps = await Employees.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json(emps);
    } catch (error) {
        console.log(error);
    }
};


const createEmployee = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error);
    }
    try {
        const employee = req.body;

        const existingEmail = await Employees.findOne({ where: { email: employee.email } });
        if (existingEmail) {
            return res.status(409).send({ error: "Employee Email already used" });
        }
        const existingPhone = await Employees.findOne({ where: { phone: employee.phone } });
        if (existingPhone) {
            return res.status(409).send({ error: "Employee Phone number already used" });
        }
        const existingN_ID = await Employees.findOne({ where: { nationalId: employee.nationalId } });
        if (existingN_ID) {
            return res.status(409).send({ error: "Employee National ID number already used" });
        }
        let regx = /^[+](250)?(\d{9})$/;
        if (!regx.test(employee.phone)) {
            return res.status(406).send("Start from +250")
        }

        let dateOne = new Date(new Date());
        let dateTwo = new Date(req.body.birthDate);

        let difference = dateOne.getFullYear() - dateTwo.getFullYear();
        if (difference < 18) {
            return res.status(406).send({ error: "You are too young you cannot be an employee" });
        }
        employee.code = "EMP" + Math.floor(1000 + Math.random() * 9000).toString();
        employee.createDate = new Date();
        await Employees.create(employee);

        sendEmailHandler("You joined Awesomity", employee.email);
        res.status(200).send({ message: "Saved successfully" });


    } catch (error) {
        console.log(error);
    }
};

const updateStatus = async (req, res) => {

    try {
        const code = req.params.code;

        const employee = await Employees.findOne({ where: { code } });

        if (!employee) {
            return res.status(400).send({ error: "Employee doesn't exist" })
        }
        if (employee.status === "INACTIVE") {
            await Employees.update({ status: "ACTIVE" }, { where: { code: code } });
            res.status(200).send("Employee is now ACTIVE")
        }
        if (employee.status === "ACTIVE") {
            await Employees.update({ status: "INACTIVE" }, { where: { code: code } });
            res.status(200).send("Employee is now INACTIVE")
        }

    } catch (error) {
        res.json(error);
    }

};

const updateSuspend = async (req, res) => {

    try {
        const code = req.params.code;

        const employee = await Employees.findOne({ where: { code } });

        if (!employee) {
            return res.status(404).send({ error: "Employee doesn't exist" })
        }

        await Employees.update({ status: "SUSPEND" }, { where: { code: code } });
        res.status(200).send("Employee is now SUSPENDED")

    } catch (error) {
        res.json(error);
    }
};

const updateEmployee = async (req, res) => {

    try {
        const code = req.params.code;
        const employee = req.body;

        const emp = await Employees.findOne({ where: { code } });

        if (!emp) {
            return res.status(404).send({ error: "Employee doesn't exist" })
        }
        await Employees.update(
            {
                name: employee.name,
                nationalId: employee.nationalId,
                phone: employee.phone,
                email: employee.email,
                birthDate: employee.birthDate,
                status: employee.status,
                position: employee.position

            }, { where: { code: code } });
        res.status(200).send("Employee data is UPDATED")

    } catch (error) {
        res.json(error);
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const code = req.params.code;

        await Employees.destroy({ where: { code } });
        res.status(200).send("Employee deleted");

    } catch (error) {
        console.log(error);
    }
};

const searchOneEmployee = async (req, res) => {
    try {
        const data = req.params.data;
        const { Op } = require("sequelize");
        const emps = await Employees.findAll({
            where: {
                [Op.or]: [
                    { code: data },
                    { position: data },
                    { name: data },
                    { email: data },
                    { phone: data }
                ]
            }, attributes: { exclude: ['password'] }
        });
        res.status(200).send(emps);
    } catch (error) {
        console.log(error);
    }
};

const activateViaEmail = async (req, res) => {

    try {
        const code = req.params.code;

        const employee = await Employees.findOne({ where: { code } });

        if (!employee) {
            return res.status(404).send({ error: "Employee doesn't exist" })
        }
        await Employees.update({ status: "ACTIVE" }, { where: { code: code } });
        res.send("After confirming your email, now your request is ACCEPTED")


    } catch (error) {
        res.json(error);
    }

};


const createEmployeeWithExcel = async (req, res) => {

    try {
        const { excelLink } = req.body;

        let dataPathExcel = excelLink;
        let wb = xlsx.readFile(dataPathExcel);
        let sheetName = wb.SheetNames[0];
        let sheetValue = wb.Sheets[sheetName];
        let excelData = xlsx.utils.sheet_to_json(sheetValue);
        for (let i = 0; i < excelData.length; i++) {


            const existingEmail = await Employees.findOne({ where: { email: excelData[i].email } });
            if (existingEmail) {
                return res.status(409).send({ error: "Employee Email already used" });
            }
            const existingPhone = await Employees.findOne({ where: { phone: excelData[i].phone } });
            if (existingPhone) {
                return res.status(409).send({ error: "Employee Phone number already used" });
            }
            const existingN_ID = await Employees.findOne({ where: { nationalId: excelData[i].nationalId } });
            if (existingN_ID) {
                return res.status(409).send({ error: "Employee National ID number already used" });
            }
            let regx = /^(250)?(\d{9})$/;
            if (!regx.test(excelData[i].phone)) {
                return res.status(406).send("Start from +250")
            }

            let dateOne = new Date(new Date());
            let dateTwo = new Date(excelData[i].birthDate);

            let difference = dateOne.getFullYear() - dateTwo.getFullYear();
            if (difference < 18) {
                return res.status(406).send({ error: "You are too young you cannot be an employee" });
            }
            excelData[i].code = "EMP" + Math.floor(1000 + Math.random() * 9000).toString();
            excelData[i].createDate = new Date();
            await Employees.create(excelData[i]);

            sendEmailHandler("You joined Awesomity", excelData[i].email);
            res.status(200).send({ message: "Saved successfully" });

        }
    } catch (error) {
        console.log(error);
    }

};



exports.getAllEmployee = getAllEmployee;
exports.createEmployee = createEmployee;
exports.deleteEmployee = deleteEmployee;
exports.updateStatus = updateStatus;
exports.updateSuspend = updateSuspend;
exports.updateEmployee = updateEmployee;
exports.searchOneEmployee = searchOneEmployee;
exports.activateViaEmail = activateViaEmail;
exports.createEmployeeWithExcel = createEmployeeWithExcel;
