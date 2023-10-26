require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const sql = require('mssql');
const { default: axios } = require('axios');
const fs = require('fs')
const app = express();
const port = 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

const connectionData = {
  server: process.env.DB_HOST,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    }
  },
  options: {
    port: 1433,
    database: process.env.DATABASE,
    trustServerCertificate: true,
    encrypt: false 
  }
};


const configurateDate = (date) => {
  if (date == 'NA') {
    return null
  }else if(date){
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


app.post('/sendfile', async (req, res) => {
  try {
      // const response = await axios.post('http://192.168.122.5:8093/testfile', req.body);
      const response = await axios.post('http://192.168.122.18:8990/sendfile', req.body);
      console.log('Response from server:', response.data);
      res.status(200).json(response.data);
  } catch (error) {
      console.error('Error connecting to server:', error);
      res.status(500).json({ error: 'Server connection error' });
  }
});



app.get('/niptforms', async (req, res) => {
  try {
    await sql.connect(connectionData);
    const queryString = 'SELECT * FROM nipt_forms';
    const result = await sql.query(queryString);
    console.log(result.recordset);
    res.send(result.recordset)
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await sql.close();
  }
})
app.get('/cancerforms', async (req, res) => {
  try {
    await sql.connect(connectionData);
    const queryString = 'SELECT * FROM cancer_forms';
    const result = await sql.query(queryString);
    console.log(result.recordset);
    res.send(result.recordset)
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await sql.close();
  }
})

app.post('/niptforms', async (req, res) => {
  try {
    await sql.connect(connectionData);
    const {formType, fetalSex, patient, pregnancyInfo, studyInfo, sampleInfo, background, aplication, entry, termsAndCondition, dateAndHour, user, os, externID} = req.body
    const parsedDateAndHour = dateAndHour.split(' ')
    const dateAndHourModified = configurateDateTime(parsedDateAndHour[0], parsedDateAndHour[1])
    const sampleDateModified = configurateDate(sampleInfo.sampleDate)
    const pregnancyTerminationModified = configurateDate(sampleInfo.pregnancyTermination)
    console.log(pregnancyTerminationModified)
    console.log(sampleInfo.pregnancyTermination)
    const text = 'INSERT INTO nipt_forms ("tipo_de_formulario", "desea_saber_el_sexo_fetal", "peso", "altura", "embarazo_gemelar", "si_es_mono_bicorial_no_sabe", "gemelo_reabsorbido", "tratamiento_de_fertilidad", "si_es_si_cual", "si_corresponde_edad_ovodotante", "si_corresp_edad_criopreserv", "edad_maternal_avanzada", "screening_trimestre_alterado", "anomalias_ecograficas_fetales", "voluntad_maternal", "observaciones", "semanas_gestacion", "dias_gestacion", "abortos_previos", "motivo_repeticion", "subrrogacion_de_utero", "nombre_padre_progenitor", "nombre_madre_progenitora", "antecedentes_de_cancer", "recibio_transplante", "sexo_donante", "nro_solicitud", "nro_ingreso", "id_anterior", "terminos_y_condiciones", "fecha_de_envio", "fecha_toma_muestra", "fecha_aprox_det_gest", "usuario", "obra_social", "id_externo") VALUES (@Value1, @Value2, @Value3, @Value4, @Value5, @Value6, @Value7, @Value8, @Value9, @Value10, @Value11, @Value12, @Value13, @Value14, @Value15, @Value16, @Value17, @Value18, @Value19, @Value20, @Value21, @Value22, @Value23, @Value24, @Value25, @Value26, @Value27, @Value28, @Value29, @Value30, @Value31, @Value32, @Value33, @Value34, @Value35, @Value36)'
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
      termsAndCondition,
      dateAndHourModified,
      sampleDateModified,
      pregnancyTerminationModified,
      user,
      os,
      externID
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
    const {formType, aplication, entry, user, os, studyInfo, patientEthnic, patientInfo, termsAndCondition, postTest, authorizedInfo, dateAndHour} = req.body
    
    const parsedDateAndHour = dateAndHour.split(' ')
    const dateAndHourModified = configurateDateTime(parsedDateAndHour[0], parsedDateAndHour[1])
    const concatCancerType = patientInfo.cancerType == 'NA' ? 'NA' : patientInfo.cancerType.length === 1 ? patientInfo.cancerType[0] : patientInfo.cancerType.join(', ')
    const text = 'INSERT INTO cancer_forms ("tipo_de_formulario", "nro_solicitud", "nro_ingreso", "panel", "nueva_muestra", "id_anterior", "etnia", "antecedentes", "edad_al_diagnostico", "tratamientos_realizados", "tipo_de_cancer", "subtipo_de_cancer_de_mama", "subtipo_de_cancer_de_ovario", "polipos", "resultado_msi", "metilacion", "valor_de_metilacion", "otro_tipo_de_cancer", "si_es_si_cual", "antecedentes_familiares", "de_que_tipo_y_de_quien", "estudios_moleculares", "orden_medica", "genograma", "motivo_de_reapertura", "observaciones", "terminos_y_condiciones", "post_test", "informacion_autorizada", "fecha_de_envio", "usuario", "obra_social") VALUES (@Value1, @Value2, @Value3, @Value4, @Value5, @Value6, @Value7, @Value8, @Value9, @Value10, @Value11, @Value12, @Value13, @Value14, @Value15, @Value16, @Value17, @Value18, @Value19, @Value20, @Value21, @Value22, @Value23, @Value24, @Value25, @Value26, @Value27, @Value28, @Value29, @Value30, @Value31, @Value32)'
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
      concatCancerType ,
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
      dateAndHourModified,
      user,
      os
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
//En IIS, reemplazar por app.listen(process.env.PORT); 