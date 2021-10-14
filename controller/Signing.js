const { Employees } = require('../models');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');


const getAll = async (req, res) => {
    try {
        const emp = await Employees.findAll();
        res.json(emp);
    } catch (error) {
        console.log(error);
    }
};


const createManager = async (req, res) => {
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

        if (employee.password !== employee.confPassword) {
            return res.json({ error: "Please re-write your password correctly" });
        }
        bcrypt.hash(employee.password, 10).then((hash) => {
            Employees.create({
                code: "EMP" + Math.floor(1000 + Math.random() * 9000).toString(),
                name: employee.name,
                nationalId: employee.nationalId,
                phone: employee.phone,
                email: employee.email,
                birthDate: employee.birthDate,
                status: employee.status,
                position: "MANAGER",
                createDate: employee.createDate,
                password: hash
            });
            res.json({ message: "Saved successfully" });
        });

    } catch (error) {
        console.log(error);
    }
};

const managerLogin = async (req, res) => {
    try {

        const { email, password } = req.body;
        const employee = await Employees.findOne({ where: { email } });
        if (!employee) {
            return res.json({ error: "user doesn't exist" });
        }
        bcrypt.compare(password, employee.password).then((match) => {
            if (!match) {
                return res.json({ error: "Wrong username or password" });
            }
            const accessToken = sign({ email: employee.email, code: employee.code, name: employee.name, role: employee.role }, "employeesMgntsys");

            res.json({ token: accessToken, name: employee.name, code: employee.code, email: employee.email });

        });

    } catch (error) {
        console.log(error);
    }
};



exports.getAll = getAll;
exports.createManager = createManager;
exports.managerLogin = managerLogin;