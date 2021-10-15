const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { validateToken } = require('../middleware/AuthMiddleware');


const signingController = require('../controller/Signing')
const manageEmployee = require('../controller/ManageEmp');


router.post('/',
    [
        check('name', 'the name is required').exists().isString().withMessage('Name can only contain letters & numbers'),
        check('phone').exists().withMessage('phone should be 10 chacacters').isString(),
        check('nationalId').exists().isLength({ min: 16, max: 16 }).withMessage('National id should be 16 numbers'),
        check('email', 'Invalid email').isEmail().normalizeEmail(),
        check('birthDate').exists(),
        check('password', 'Password required').exists(),
        check('confPassword', 'Confirm Password field required').exists(),
    ],
    signingController.createManager);
router.post('/login', signingController.managerLogin);
router.put('/employee/restPassword/:code', validateToken, signingController.restPassword);

//manage employees
router.get('/employee/', validateToken, manageEmployee.getAllEmployee);
router.post('/employee/', validateToken,
    [
        check('name', 'the name is required').exists().isString().withMessage('Name can only contain letters & numbers'),
        check('phone').exists().withMessage('phone should be 10 chacacters').isString(),
        check('nationalId').exists().isLength({ min: 16, max: 16 }).withMessage('National id should be 16 numbers'),
        check('email', 'Invalid email').isEmail().normalizeEmail(),
        check('birthDate').exists().isString(),
        check('position').exists(),
    ],
    manageEmployee.createEmployee);
router.put('/employee/status/:code', validateToken, manageEmployee.updateStatus);
router.put('/employee/suspend/:code', validateToken, manageEmployee.updateSuspend);
router.put('/employee/update/:code', validateToken, manageEmployee.updateEmployee);
router.delete('/employee/:code', validateToken, manageEmployee.deleteEmployee);
router.get('/employee/search/:data', validateToken, manageEmployee.searchOneEmployee)
router.get('/employee/verify/:code', manageEmployee.activateViaEmail);



module.exports = router;