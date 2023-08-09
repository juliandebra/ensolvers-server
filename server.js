import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';
import pkg from 'pg';
const {Client} = pkg
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(path.join(__dirname + "/public")))

const connectionData = {
  user: 'postgres',
  host: 'localhost',
  database: 'cibic',
  password: 'labtory1407',
  port: 5432,
}
const client = new Client(connectionData)

client.connect()
client.query('SELECT * FROM nipt_forms')
    .then(response => {
        console.log(response.rows)
        client.end()
    })
    .catch(err => {
        client.end()
    })

let niptforms = []
let cancerforms = []

app.get('/niptforms', (req, res) => {
    res.send(niptforms);
})
app.get('/cancerforms', (req, res) => {
  res.send(cancerforms);
})

app.post('/niptforms', (req, res) => {
    niptforms = [...niptforms, req.body];
    res.send("Form sent");
})
app.post('/cancerforms', (req, res) => {
  cancerforms = [...cancerforms, req.body];
  res.send("Form sent");
})

app.all('/*', (req, res, next) => {
    res.send('That route does not exist!');
});

app.listen(port);

