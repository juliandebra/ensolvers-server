require('dotenv').config();
const express = require('express');
const router = express.Router();
const Note = require('../models/note')
const { Op } = require('sequelize'); 

router.get('/filterbydate/:date', async (req, res) => {
    const { date } = req.params;
    try {
        const results = await Note.findAll({ where: { date } });
        res.send(results);
    } catch(err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/filterbytext/:text', async (req, res) => {
    const { text } = req.params;
    try {
        const results = await Note.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${text}%` } },
                    { description: { [Op.like]: `%${text}%` } },
                    { tags: { [Op.like]: `%${text}%` } }
                ]
            }
        });
        res.send(results);
    } catch(err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;