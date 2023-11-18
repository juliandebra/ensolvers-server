require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()
const port = 5000
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname, '/public')))
const pg = require('pg')
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

const notesRouter = require('./routes/notes')
const filtersRouter = require('./routes/filters')
app.use('/notes', notesRouter)
app.use('/filters', filtersRouter)

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.get('/ping', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  return res.json(result.rows[0])
})
process.on('SIGINT', async () => {
  await client.end()
  process.exit()
})

app.all('/*', (req, res, next) => {
    res.send('That route does not exist!')
})

app.listen(port)
