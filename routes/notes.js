require('dotenv').config();
const express = require('express');
const router = express.Router();
const Note = require('../models/note');

router.get('/getnotes', async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.send(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/getnote/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByPk(id);
    res.send(note);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
});

router.post('/createnote', async (req, res) => {
  try {
    const { title, description, date, tags } = req.body;
    const newNote = await Note.create({ title, description, date, tags });
    res.status(201).send(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
});

router.delete('/deletenote/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Note.destroy({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
});

router.put('/editnote/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, date, tags } = req.body;
  try {
    await Note.update({ title, description, date, tags }, { where: { id } });
    const updatedNote = await Note.findByPk(id);
    res.status(200).send(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;