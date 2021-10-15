const { Employees } = require('../models');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const sendEmailHandler = require('../util/sendEmail')


const getAllEmployee = async (req, res) => {
    try {
        const emps = await Employees.findAll({ attributes: { exclude: ['password'] } });
        res.json(emps);
    } catch (error) {
        console.log(error);
    }
};


const createEmployee = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json(error);
    }
    try {
        const employee = req.body;

        const existingEmail = await Employees.findOne({ where: { email: employee.email } });
        if (existingEmail) {
            return res.json({ error: "User Email already used" });
        }
        const existingPhone = await Employees.findOne({ where: { phone: employee.phone } });
        if (existingPhone) {
            return res.json({ error: "User Phone number already used" });
        }
        const existingN_ID = await Employees.findOne({ where: { nationalId: employee.nationalId } });
        if (existingN_ID) {
            return res.json({ error: "User National ID number already used" });
        }
        let regx = /^[+](250)?(\d{9})$/;
        if (!regx.test(employee.phone)) {
            return res.json("Start from +250")
        }

        let dateOne = new Date(new Date());
        let dateTwo = new Date(req.body.birthDate);

        let difference = dateOne.getFullYear() - dateTwo.getFullYear();
        if (difference < 18) {
            return res.json({ error: "You are too young you cannot be an employee" });
        }
        employee.code = "EMP" + Math.floor(1000 + Math.random() * 9000).toString();
        employee.createDate = new Date();
        await Employees.create(employee);

        sendEmailHandler("Employee of Awesomity", employee.email);
        res.json({ message: "Saved successfully" });


    } catch (error) {
        console.log(error);
    }
};

const updateStatus = async (req, res) => {

    try {
        const code = req.params.code;

        const employee = await Employees.findOne({ where: { code } });

        if (!employee) {
            return res.json({ error: "User doesn't exist" })
        }
        if (employee.status === "INACTIVE") {
            await Employees.update({ status: "ACTIVE" }, { where: { code: code } });
            res.json("Employee is now ACTIVE")
        }
        if (employee.status === "ACTIVE") {
            await Employees.update({ status: "INACTIVE" }, { where: { code: code } });
            res.json("Employee is now INACTIVE")
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
            return res.json({ error: "User doesn't exist" })
        }

        await Employees.update({ status: "SUSPEND" }, { where: { code: code } });
        res.json("Employee is now SUSPENDED")

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
            return res.json({ error: "User doesn't exist" })
        }
        await Employees.update(
            {
                name: employee.name,
                nationalId: employee.nationalId,
                phone: employee.phone,
                email: employee.email,
                birthDate: employee.birthDate,
                position: employee.position

            }, { where: { code: code } });
        res.json("Employee data is UPDATED")

    } catch (error) {
        res.json(error);
    }
};



const deleteEmployee = async (req, res) => {
    try {
        const code = req.params.code;

        await Employees.destroy({ where: { code } });
        res.json("User deleted");

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
            }
        });
        res.json(emps);
    } catch (error) {
        console.log(error);
    }
};

const activateViaEmail = async (req, res) => {

    try {
        const code = req.params.code;

        const employee = await Employees.findOne({ where: { code } });

        if (!employee) {
            return res.json({ error: "User doesn't exist" })
        }
        await Employees.update({ status: "ACTIVE" }, { where: { code: code } });
        res.send("after confirming your email now you are ACTIVED")


    } catch (error) {
        res.json(error);
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
