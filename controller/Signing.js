const { Employees } = require('../models');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const sendEmailHandler = require('../util/sendEmail')



const createManager = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).send(error);
    }
    try {

        const employee = req.body;

        const existingEmail = await Employees.findOne({ where: { email: employee.email } });
        if (existingEmail) {
            return res.status(409).send({ error: "Email already used" });
        }
        const existingPhone = await Employees.findOne({ where: { phone: employee.phone } });
        if (existingPhone) {
            return res.status(409).send({ error: "Phone number already used" });
        }
        const existingN_ID = await Employees.findOne({ where: { nationalId: employee.nationalId } });
        if (existingN_ID) {
            return res.status(409).send({ error: "National ID number already used" });
        }

        let regx = /^[+](250)?(\d{9})$/;
        if (!regx.test(employee.phone)) {
            return res.status(406).send("Start from +250")
        }

        let dateOne = new Date(new Date());
        let dateTwo = new Date(req.body.birthDate);

        let difference = dateOne.getFullYear() - dateTwo.getFullYear();
        if (difference < 18) {
            return res.status(406).send({ error: "You are too young you cannot be a manager" });
        }
        if (employee.password !== employee.confPassword) {
            return res.status(409).send({ error: "Please re-write your password correctly" });
        }

        const empCode = "EMP" + Math.floor(1000 + Math.random() * 9000).toString();

        const setLink = "Hi! <a href=" + "http://localhost:5000/api/employee/verify/" + empCode + ">Click here to verify</a>";

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
            res.status(200).send({ message: "Saved successfully" });
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
            return res.status(404).send({ error: "user doesn't exist" });
        }
        if (employee.status !== "ACTIVE") {
            return res.status(406).send({ error: "Your account is not ACTIVE you didn't CONFIRM ON YOUR EMAIL" });
        }
        bcrypt.compare(password, employee.password).then((match) => {
            if (!match) {
                return res.json({ error: "Wrong username or password" });
            }
            const accessToken = sign({ email: employee.email, code: employee.code, name: employee.name, position: employee.position }, "employeesMgntsys");
            res.json({ token: accessToken, name: employee.name, code: employee.code, email: employee.email });
        });

    } catch (error) {
        console.log(error);
    }
};

const restPassword = async (req, res) => {

    try {
        const code = req.params.code;
        const password = req.body.password;

        const employee = await Employees.findOne({ where: { code } });

        if (!employee) {
            return res.status(404).send({ error: "User doesn't exist" })
        }

        bcrypt.hash(password, 10).then((hash) => {
            Employees.update({
                status: "INACTIVE",
                password: hash
            }, { where: { code: code } });
            res.json("Your password is changed but you need to confirm on you EMAIL");
            const setLink = "Hi! <a href=" + "http://localhost:5000/api/employee/verify/" + code + ">Click here to verify</a>";
            sendEmailHandler(setLink, employee.email);
        });


    } catch (error) {
        res.json(error);
    }

};



exports.createManager = createManager;
exports.managerLogin = managerLogin;
exports.restPassword = restPassword;