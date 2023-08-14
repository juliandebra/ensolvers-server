import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';
import { config } from 'dotenv'
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(path.join(__dirname + "/public")))

config()

// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   // ssl: true
// })

// const connectionData = {
//   user: 'cibic_user',
//   host: 'dpg-cj9thc2vvtos738sf3mg-a',
//   database: 'cibic',
//   password: 'QweygHONVkIqwcjy4JJCBG4F0AxI8COT',
//   port: 5432,
// }

const connectionData = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'labtory1407',
  port: 5432,
}
const client = new pg.Client(connectionData)
client.connect()
let niptforms = []

app.get('/testform', async (req, res) => {
  const result = await client.query('SELECT * FROM nipt_forms')
  res.send(result.rows);
})


 
// client.connect()
// client.query('SELECT * FROM nipt_forms')
//     .then(response => {
//         console.log(response.rows)
//         client.end()
//     })
//     .catch(err => {
//         client.end()
//     })


let cancerforms = []

app.get('/niptforms', (req, res) => {
    res.send(niptforms);
})
app.get('/cancerforms', (req, res) => {
  res.send(cancerforms);
})

app.post('/niptforms', async (req, res) => {
  try {
    const text = 'INSERT INTO nipt_forms ("tipo_de_formulario", "desea_saber_el_sexo_fetal", "peso", "altura", "embarazo_gemelar", "si_es_mono_bicorial_no_sabe", "gemelo_reabsorbido", "tratamiento_de_fertilidad", "si_es_si_cual", "si_corresponde_edad_ovodotante", "si_corresp_edad_criopreserv", "edad_maternal_avanzada", "screening_trimestre_alterado", "anomalias_ecograficas_fetales", "voluntad_maternal", "observaciones", "semanas_gestacion", "dias_gestacion", "fecha_aprox_det_gest", "abortos_espontaneos", "abortos_previos", "motivo_repeticion", "subrrogacion_de_utero", "nombre_padre_progenitor", "nombre_madre_progenitora", "antecedentes_de_cancer", "recibio_transplante", "sexo_donante", "nro_solicitud", "id_externo", "id_anterior") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)'
    const values = [
      req.body.formType, 
      req.body.fetalSex, 
      req.body.patient.weight ,
      req.body.patient.height ,
      req.body.pregnancyInfo.twinPregnancy ,
      req.body.pregnancyInfo.twinPregnancyType ,
      req.body.pregnancyInfo.twinVanishing ,
      req.body.pregnancyInfo.fertilityTreatment,
      req.body.pregnancyInfo.fertilityTreatmentType ,
      req.body.pregnancyInfo.eggDonorAge ,
      req.body.pregnancyInfo.cryopreservationAge ,
      req.body.studyInfo.advancedMaternalAge ,
      req.body.studyInfo.firstScreening ,
      req.body.studyInfo.anomalies ,
      req.body.studyInfo.maternalWill ,
      req.body.studyInfo.observations,
      req.body.sampleInfo.week ,
      req.body.sampleInfo.day ,
      req.body.sampleInfo.pregnancyDate ,
      req.body.studyInfo.spontaneousAbortions ,
      req.body.studyInfo.prevAbortions ,
      req.body.sampleInfo.repetitionReason ,
      req.body.pregnancyInfo.subrogation ,
      req.body.pregnancyInfo.father,
      req.body.pregnancyInfo.mother ,
      req.body.background.cancer ,
      req.body.background.transplant ,
      req.body.background.transplantSex ,
      req.body.aplication ,
      req.body.entry ,
      req.body.sampleInfo.prevId 
    ]
    await client.query(text, values)
    res.send("Form sent");
  }
  catch(err) {
    console.error(err.stack);
  } 
})

// const test = async () => {
//   try {
//     const text = 'INSERT INTO nipt_forms ("tipo_de_formulario", "desea_saber_el_sexo_fetal") VALUES ($1, $2)'
//     const values =  ['2235', true]
//     const res = await client.query(text, values)
//     console.log(res)
//     res.send("Form sent");
//   }
//   catch(err) {
//     console.error(err.stack);
//   } 
//   finally{
//     await client.end()
//   }
// } 
// test()
// app.post('/niptforms', async (req, res) => {
//   // console.log(req.body)
//     niptforms = [...niptforms, req.body];
//     const text = `INSERT INTO "nipt_forms"  
//     ("tipo_de_formulario", "desea_saber_el_sexo_fetal", "peso", "altura", "embarazo_gemelar", "si_es_mono_bicorial_no_sabe", "gemelo_reabsorbido", "tratamiento_de_fertilidad", "si_es_si_cual", "si_corresponde_edad_ovodotante", "si_corresp_edad_criopreserv", "edad_maternal_avanzada", "screening_trimestre_alterado", "anomalias_ecograficas_fetales", "voluntad_maternal", "observaciones", "semanas_gestacion", "dias_gestacion", "fecha_aprox_det_gest", "abortos_espontaneos", "abortos_previos", "motivo_repeticion", "subrrogacion_de_utero", "nombre_padre_progenitor", "nombre_madre_progenitora", "antecedentes_de_cancer", "recibio_transplante", "sexo_donante", "nro_solicitud", "id_externo", "id_anterior")
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)`
    
//     const values = [
//       req.body.formType,
//       req.body.fetalSex ,
//       req.body.patient.weight ,
//       req.body.patient.height ,
//       req.body.pregnancyInfo.twinPregnancy ,
//       req.body.pregnancyInfo.twinPregnancyType ,
//       req.body.pregnancyInfo.twinVanishing ,
//       req.body.pregnancyInfo.fertilityTreatment ,
//       req.body.pregnancyInfo.fertilityTreatmentType ,
//       req.body.pregnancyInfo.eggDonorAge ,
//       req.body.pregnancyInfo.cryopreservationAge ,
//       req.body.studyInfo.studyType[0] ,
//       req.body.studyInfo.firstScreening ,
//       req.body.studyInfo.anomalies ,
//       req.body.studyInfo.studyType[1] ,
//       req.body.studyInfo.observations ,
//       req.body.sampleInfo.week ,
//       req.body.sampleInfo.day ,
//       req.body.sampleInfo.pregnancyDate ,
//       req.body.studyInfo.spontaneousAbortions ,
//       req.body.studyInfo.prevAbortions ,
//       req.body.sampleInfo.repetitionReason ,
//       req.body.pregnancyInfo.subrogation ,
//       req.body.pregnancyInfo.father ,
//       req.body.pregnancyInfo.mother ,
//       req.body.background.cancer ,
//       req.body.background.transplant ,
//       req.body.background.transplantSex ,
//       req.body.aplication ,
//       req.body.entry ,
//       req.body.sampleInfo.prevId ,
//     ]
//     await client.query(text, values)
//     // console.log(result)
//     // client.end()
//     res.send("Form sent");
// })
app.post('/cancerforms', (req, res) => {
  cancerforms = [...cancerforms, req.body];
  res.send("Form sent");
})

app.all('/*', (req, res, next) => {
    res.send('That route does not exist!');
});

app.listen(port);



// api-key aea36b3d-cec6-482c-81f2-156ecb6eaf31
// db cibic
// user cibic_user
// host dpg-cj9thc2vvtos738sf3mg-a



// pass QweygHONVkIqwcjy4JJCBG4F0AxI8COT
// internal db url postgres://cibic_user:QweygHONVkIqwcjy4JJCBG4F0AxI8COT@dpg-cj9thc2vvtos738sf3mg-a/cibic
// external db url postgres://cibic_user:QweygHONVkIqwcjy4JJCBG4F0AxI8COT@dpg-cj9thc2vvtos738sf3mg-a.oregon-postgres.render.com/cibic
// psql command PGPASSWORD=QweygHONVkIqwcjy4JJCBG4F0AxI8COT psql -h dpg-cj9thc2vvtos738sf3mg-a.oregon-postgres.render.com -U cibic_user cibic