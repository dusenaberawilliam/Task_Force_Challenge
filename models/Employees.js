module.exports = (sequelize, DataTypes) => {

    const Employees = sequelize.define("Employees", {
        code: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nationalId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        birthDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return Employees;
}

