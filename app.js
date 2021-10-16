const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();

app.use(cors());
app.use(express.json());


//routers
const employeeManagementRouter = require('./routes/EmpManagement-route');
app.use('/api', employeeManagementRouter);

const port = process.env.PORT || 5000
const db = require('./models');
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server is running")
    });
})
    .catch((err) => {
        console.log(err);
    })
