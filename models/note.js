const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Note = sequelize.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Title is required.',
      },
      notEmpty: {
        msg: 'Title cannot be empty.',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Description is required.',
      },
      notEmpty: {
        msg: 'Description cannot be empty.',
      },
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Date is required',
      },
      isDate: {
        msg: 'Must be a valid date',
      },
    },
  },
  tags: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'notes',
})

module.exports = Note