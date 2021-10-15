const { Employees } = require('../models');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const sendEmailHandler = require('../util/sendEmail')



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

        let dateOne = new Date(new Date());
        let dateTwo = new Date(req.body.birthDate);

        let difference = dateOne.getFullYear() - dateTwo.getFullYear();
        if (difference < 18) {
            return res.json({ error: "You are too young you cannot be a manager" });
        }
        if (employee.password !== employee.confPassword) {
            return res.json({ error: "Please re-write your password correctly" });
        }

        const empCode = "EMP" + Math.floor(1000 + Math.random() * 9000).toString();

        const setLink = "Hi! <a href=" + "http://localhost:5000/employee/verify/" + empCode + ">Click here to verify</a>";

        bcrypt.hash(employee.password, 10).then((hash) => {
            Employees.create({
                code: empCode,
                name: employee.name,
                nationalId: employee.nationalId,
                phone: employee.phone,
                email: employee.email,
                birthDate: employee.birthDate,
                status: "INACTIVE",
                position: "MANAGER",
                createDate: new Date(),
                password: hash
            });
            sendEmailHandler(setLink, employee.email);
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

const restPassword = async (req, res) => {

    try {
        const code = req.params.code;

        const employee = await Employees.findOne({ where: { code } });

        if (!employee) {
            return res.json({ error: "User doesn't exist" })
        }
        await Employees.update({ status: "INACTIVE", password: req.password }, { where: { code: code } });
        res.json("Your password is changed but you need to confirm on you EMAIL");
        const setLink = "Hi! <a href=" + "http://localhost:5000/employee/verify/" + code + ">Click here to verify</a>";
        sendEmailHandler(setLink, employee.email);

    } catch (error) {
        res.json(error);
    }

};



exports.createManager = createManager;
exports.managerLogin = managerLogin;
exports.restPassword = restPassword;