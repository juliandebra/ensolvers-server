import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';
import { config } from 'dotenv'
import sql from 'mssql'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 5000;
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
app.use(express.static(path.join(__dirname + "/public")))

config()


let niptforms = []
let cancerforms = []

const connectionData = {
  server: '192.168.122.2',
  authentication: {
    type: 'default',
    options: {
      userName: 'jdebrabandere',
      password: 'D3br4b4nd3rE*',
    }
  },
  options: {
    port: 1433,
    database: 'CibicForms',
    trustServerCertificate: true,
    encrypt: false 
  }
};

app.get('/testform', async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(connectionData);
    // Query string
    const queryString = 'SELECT * FROM nipt_forms'; // Replace with your actual table name
    // Execute the query
    const result = await sql.query(queryString);
    // Print the result
    console.log(result.recordset);
    res.send(result.recordset)
  } catch (error) {
    // Handle errors
    console.error('Error executing query:', error);
  } finally {
    // Close the connection
    await sql.close();
  }
})


// const connectionData = {
//   user: 'jdebrabandere',
//   host: '192.168.122.2',
//   database: 'CibicForms',
//   password: 'D3br4b4nd3rE*',
//   port: 1433,
// }

// app.get('/testform', async (req, res) => {
//   const result = await client.query('SELECT * FROM nipt_forms')
//   res.send(result.rows);
// })


const configurateDate = (date) => {
  if(date){
    const dateComponents = date.split("/"); 
    const day = parseInt(dateComponents[0], 10);
    const month = parseInt(dateComponents[1], 10) - 1; 
    const year = parseInt(dateComponents[2], 10);
  
    return new Date(year, month, day)
  } 
  else {
    return null
  }
}

const configurateDateTime = (date, time) => {
  const dateComponents = date.split("/"); 
  const day = parseInt(dateComponents[0], 10);
  const month = parseInt(dateComponents[1], 10) - 1; 
  const year = parseInt(dateComponents[2], 10);

  const timeComponents = time.split(":");
  const hours = parseInt(timeComponents[0], 10) -3;
  const minutes = parseInt(timeComponents[1], 10);

  return new Date(year, month, day, hours, minutes)
}

app.get('/niptforms', (req, res) => {
    res.send(niptforms);
})
app.get('/cancerforms', (req, res) => {
  res.send(cancerforms);
})

app.post('/niptforms', async (req, res) => {
  try {
    await sql.connect(connectionData);
    const {formType, fetalSex, patient, pregnancyInfo, studyInfo, sampleInfo, background, aplication, entry, termsAndCondition, dateAndHour} = req.body
    const parsedDateAndHour = dateAndHour.split(' ')
    const dateAndHourModified = configurateDateTime(parsedDateAndHour[0], parsedDateAndHour[1])
    const sampleDateModified = configurateDate(sampleInfo.sampleDate)
    const pregnancyTerminationModified = configurateDate(sampleInfo.pregnancyTermination)

    const text = 'INSERT INTO nipt_forms ("tipo_de_formulario", "desea_saber_el_sexo_fetal", "peso", "altura", "embarazo_gemelar", "si_es_mono_bicorial_no_sabe", "gemelo_reabsorbido", "tratamiento_de_fertilidad", "si_es_si_cual", "si_corresponde_edad_ovodotante", "si_corresp_edad_criopreserv", "edad_maternal_avanzada", "screening_trimestre_alterado", "anomalias_ecograficas_fetales", "voluntad_maternal", "observaciones", "semanas_gestacion", "dias_gestacion", "abortos_previos", "motivo_repeticion", "subrrogacion_de_utero", "nombre_padre_progenitor", "nombre_madre_progenitora", "antecedentes_de_cancer", "recibio_transplante", "sexo_donante", "nro_solicitud", "nro_ingreso", "id_anterior", "archivo_tipo_de_estudio", "terminos_y_condiciones", "fecha_de_envio", "fecha_toma_muestra", "fecha_aprox_det_gest") VALUES (@Value1, @Value2, @Value3, @Value4, @Value5, @Value6, @Value7, @Value8, @Value9, @Value10, @Value11, @Value12, @Value13, @Value14, @Value15, @Value16, @Value17, @Value18, @Value19, @Value20, @Value21, @Value22, @Value23, @Value24, @Value25, @Value26, @Value27, @Value28, @Value29, @Value30, @Value31, @Value32, @Value33, @Value34)'
    const values = [
      formType.toString(), 
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
      studyInfo.prevAbortions ,
      sampleInfo.repetitionReason ,
      pregnancyInfo.subrogation ,
      pregnancyInfo.father,
      pregnancyInfo.mother ,
      background.cancer ,
      background.transplant ,
      background.transplantSex ,
      aplication,
      entry,
      sampleInfo.prevId,
      studyInfo.file,
      termsAndCondition,
      dateAndHourModified,
      sampleDateModified,
      pregnancyTerminationModified
    ]

    const request = new sql.Request();
    for (let i = 0; i < values.length; i++) {
      request.input(`Value${i + 1}`, values[i]);
    }

    await request.query(text);
    res.send("Form sent");
  }
  catch(err) {
    console.error(err.stack);
  } finally {
    await sql.close();
  }
})

app.post('/cancerforms', async (req, res) => {
  try{
    await sql.connect(connectionData);
    const {formType, aplication, entry, studyInfo, patientEthnic, patientInfo, termsAndCondition, postTest, authorizedInfo, dateAndHour} = req.body
    
    const parsedDateAndHour = dateAndHour.split(' ')
    const dateAndHourModified = configurateDateTime(parsedDateAndHour[0], parsedDateAndHour[1])
    const text = 'INSERT INTO cancer_forms ("tipo_de_formulario", "nro_solicitud", "nro_ingreso", "panel", "nueva_muestra", "id_anterior", "etnia", "antecedentes", "edad_al_diagnostico", "tratamientos_realizados", "tipo_de_cancer", "subtipo_de_cancer_de_mama", "subtipo_de_cancer_de_ovario", "polipos", "resultado_msi", "metilacion", "valor_de_metilacion", "otro_tipo_de_cancer", "si_es_si_cual", "antecedentes_familiares", "de_que_tipo_y_de_quien", "estudios_moleculares", "orden_medica", "genograma", "motivo_de_reapertura", "observaciones", "terminos_y_condiciones", "post_test", "informacion_autorizada", "fecha_de_envio") VALUES (@Value1, @Value2, @Value3, @Value4, @Value5, @Value6, @Value7, @Value8, @Value9, @Value10, @Value11, @Value12, @Value13, @Value14, @Value15, @Value16, @Value17, @Value18, @Value19, @Value20, @Value21, @Value22, @Value23, @Value24, @Value25, @Value26, @Value27, @Value28, @Value29, @Value30)'
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
      patientInfo.observations,
      termsAndCondition,
      postTest,
      authorizedInfo,
      dateAndHourModified
    ]
    const request = new sql.Request();
    for (let i = 0; i < values.length; i++) {
      request.input(`Value${i + 1}`, values[i]);
    }

    await request.query(text);
    res.send("Form sent");
  }
  catch(err){
    console.error(err.stack);
  } finally {
    await sql.close();
  }
})

app.all('/*', (req, res, next) => {
    res.send('That route does not exist!');
});

app.listen(port);


// console.log('pregnancyTermination',sampleInfo.pregnancyTermination)
// console.log('sampleDate', sampleInfo.sampleDate)

