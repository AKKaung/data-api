const express = require('express');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

const SensorData = sequelize.define('sensor-data', {
    sensorId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    temperature: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
})

// const app = express();
const port = 5433;
app.use(express.json());

app.get('/data', async (req, res) => {
    const allData = await SensorData.findAll();
    res.status(200).send(allData);
    return;
});

app.post('/data', async (req, res) => {
    const data = req.body;
    const sensorData = await SensorData.create(data);
    res.status(201).send(sensorData);
    return;
});

app.listen({ port: 8080 }, () => {
    try {
        sequelize.authenticate();
        console.log('Connected to database');
        sequelize.sync({ alter: true });
        console.log('Sync to database')
    } catch (error) {
        console.log('Could not connected to database!', error);
    }
    console.log(`Server is running on http://localhost:${port}`);
});