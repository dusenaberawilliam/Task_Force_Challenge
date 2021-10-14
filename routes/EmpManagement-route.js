const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');


const signingController = require('../controller/Signing')

router.get('/', signingController.getAll);
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



module.exports = router;