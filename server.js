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
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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



let cancerforms = []

app.get('/niptforms', (req, res) => {
    res.send(niptforms);
})
app.get('/cancerforms', (req, res) => {
  res.send(cancerforms);
})

app.post('/niptforms', async (req, res) => {
  try {
    const {formType, fetalSex, patient, pregnancyInfo, studyInfo, sampleInfo, background, aplication, entry, termsAndCondition, dateAndHour} = req.body
    const text = 'INSERT INTO nipt_forms ("tipo_de_formulario", "desea_saber_el_sexo_fetal", "peso", "altura", "embarazo_gemelar", "si_es_mono_bicorial_no_sabe", "gemelo_reabsorbido", "tratamiento_de_fertilidad", "si_es_si_cual", "si_corresponde_edad_ovodotante", "si_corresp_edad_criopreserv", "edad_maternal_avanzada", "screening_trimestre_alterado", "anomalias_ecograficas_fetales", "voluntad_maternal", "observaciones", "semanas_gestacion", "dias_gestacion", "fecha_aprox_det_gest", "abortos_previos", "motivo_repeticion", "subrrogacion_de_utero", "nombre_padre_progenitor", "nombre_madre_progenitora", "antecedentes_de_cancer", "recibio_transplante", "sexo_donante", "nro_solicitud", "id_externo", "id_anterior", "archivo_tipo_de_estudio", "fecha_toma_muestra", "terminos_y_condiciones", "fecha_de_envio") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)'
    const values = [
      formType, 
      fetalSex, 
      patient.weight ,
      patient.height ,
      pregnancyInfo.twinPregnancy ,
      pregnancyInfo.twinPregnancyType ,
      pregnancyInfo.twinVanishing ,
      pregnancyInfo.fertilityTreatment,
      pregnancyInfo.fertilityTreatmentType ,
      pregnancyInfo.eggDonorAge ,
      pregnancyInfo.cryopreservationAge ,
      studyInfo.advancedMaternalAge ,
      studyInfo.firstScreening ,
      studyInfo.anomalies ,
      studyInfo.maternalWill ,
      studyInfo.observations,
      sampleInfo.week ,
      sampleInfo.day , 
      studyInfo.pregnancyTermination ,
      studyInfo.prevAbortions ,
      sampleInfo.repetitionReason ,
      pregnancyInfo.subrogation ,
      pregnancyInfo.father,
      pregnancyInfo.mother ,
      background.cancer ,
      background.transplant ,
      background.transplantSex ,
      aplication ,
      entry,
      sampleInfo.prevId,
      studyInfo.file,
      sampleInfo.sampleDate ,
      termsAndCondition,
      dateAndHour
    ]
    await client.query(text, values)
    res.send("Form sent");
  }
  catch(err) {
    console.error(err.stack);
  } 
})

app.post('/cancerforms', async (req, res) => {
  try{
    const {formType, aplication, entry, studyInfo, patientEthnic, patientInfo, termsAndCondition, postTest, authorizedInfo, dateAndHour} = req.body
    const text = 'INSERT INTO cancer_forms ("tipo_de_formulario", "nro_solicitud", "id_externo", "panel", "nueva_muestra", "id_anterior", "etnia", "antecedentes", "edad_al_diagnostico", "tratamientos_realizados", "tipo_de_cancer", "subtipo_de_cancer_de_mama", "subtipo_de_cancer_de_ovario", "polipos", "resultado_msi", "metilacion", "valor_de_metilacion", "otro_tipo_de_cancer", "si_es_si_cual", "antecedentes_familiares", "de_que_tipo_y_de_quien", "estudios_moleculares", "orden_medica", "genograma", "motivo_de_reapertura", "terminos_y_condiciones", "post_test", "informacion_autorizada", "fecha_de_envio") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)'
    const values = [
      formType,
      aplication,
      entry,
      studyInfo.panel,
      studyInfo.newSample,
      studyInfo.prevId,
      patientEthnic,
      patientInfo.background ,
      patientInfo.diagnosisAge ,
      patientInfo.treatmentDone ,
      patientInfo.cancerType ,
      patientInfo.mamalCancerSubtype ,
      patientInfo.ovaryCancerSubtype ,
      patientInfo.polyps ,
      patientInfo.MSIResult ,
      patientInfo.metilation ,
      patientInfo.value ,
      patientInfo.otherCancer ,
      patientInfo.otherCancerType,
      patientInfo.familyBackground ,
      patientInfo.familyBackgroundInfo,
      patientInfo.molecularStudiesFile,
      patientInfo.medicalOrderFile,
      patientInfo.genogramFile,
      patientInfo.reopeningReason,
      termsAndCondition,
      postTest,
      authorizedInfo,
      dateAndHour
    ]
    await client.query(text, values)
    res.send("Form sent");
  }
  catch(err){
    console.error(err.stack);
  }
  
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