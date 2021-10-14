const express = require('express');
const app = express();
const cors = require('cors')

app.use(cors());
app.use(express.json());


//routers
const employeeManagementRouter = require('./routes/EmpManagement-route');
app.use('/', employeeManagementRouter);

const db = require('./models');
db.sequelize.sync().then(() => {
    app.listen(5000, () => {
        console.log("Server is running")
    });
})
    .catch((err) => {
        console.log(err);
    })
