const path = require('path')
const express = require('express')
const xss = require('xss')
const ScheduleService = require('./schedule-service')

const scheduleRouter = express.Router()
const jsonParser = express.json()

//sanitize the schedule table
const serializeSchedule = schedule => ({
  id: schedule.id,
  emp_name: xss(schedule.emp_name),
  monday: xss(schedule.monday),
  tuesday: xss(schedule.tuesday),
  wednesday: xss(schedule.wednesday),
  thursday: xss(schedule.thursday),
  friday: xss(schedule.friday),
  saturday: xss(schedule.saturday),
  sunday: xss(schedule.sunday),
});

//sanitize the employee table
const serializeEmployee = employee => ({
    id: employee.id,
    business_id: employee.business_id,
    emp_name: xss(employee.emp_name),
    emp_availability: xss(employee.emp_availability),
  });

  //sanitize the shr table
const serializeSHR = shr => ({
    id: shr.id,
    business_id: shr.business_id,
    shift_time: xss(shr.shift_time),
    monday: shr.monday,
    tuesday: shr.tuesday,
    wednesday: shr.wednesday,
    thursday: shr.thursday,
    friday: shr.friday,
    saturday: shr.saturday,
    sunday: shr.sunday,
  });
  
  //sanitize the business table
const serializeBusiness = business => ({
    id: business.id,
    business_name: xss(business.business_name),
  });

  //sanitize the operation table
const serializeOperation = operation => ({
    id: operation.id,
    business_id: operation.business_id,
    day: xss(operation.day),
    open_time: xss(operation.open_time),
    close_time: xss(operation.close_time),
  });

  function chooseSerialize(table){
    console.log('\nSERIALIZE FUNCTION IS EXECUTING\n');
    if(table==='schedule'){
        return serializeSchedule; 
    }
    else if (table==='employee'){
        console.log('EMPLOYEE CHOSEN');
        return serializeEmployee;
    }
    else if(table==='shr'){
        return serializeSHR;
    }
    else if(table==='business'){
        console.log('\nbusiness HAS BEEN CHOSEN\n')
        return serializeBusiness;
    }
    else if(table==='operation'){
        return serializeOperation;
    }
  }
  

/*
 ------------ MASS GRAB OF DATA
 */
scheduleRouter
  .route('/all')
  /* -------------------

    G E T: get all info from a table

     ------------------- */
  .get((req, res, next) => {
    //grabbing the database and table
    const knexInstance = req.app.get('db');
    const table = req.app.get('table');

    //making the call to the method that will get the data from the DataBase
    ScheduleService.getAllData(knexInstance, table)
      .then(response => {

          //call a function that will decide which method to iterate for serialization
          const serializeFunction = chooseSerialize(table);
          res.json(response.map( serializeFunction ));        
      })
      .catch(next)
  })
  /* -------------------

    P O S T: ADD NEW ROW

     ------------------- */
  .post(jsonParser, (req, res, next) => {

    const data = req.body;
    const table = req.app.get('table');

    for (const [key, value] of Object.entries(data))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    ScheduleService.insertData(
      req.app.get('db'),
      table,
      data
    )
    .then(responseData => {
        const serializeFunction = chooseSerialize(table);
        
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${responseData.id}`))
          .json(serializeFunction(responseData))
      })
      .catch(next)
  })


  /*
 ------------ SINGLE GRAB OF DATA BY ID
 */
scheduleRouter
  .route('/:data_id')
  /* -------------------
    Requesting data by ID: save to "res.data" for any 
      endpoints to use
     ------------------- */
  .all((req, res, next) => {
    ScheduleService.getById(
      req.app.get('db'),
      req.app.get('table'),
      req.params.data_id
    )
      .then(data => {
        if (!data) {
          return res.status(404).json({
            error: { message: `data doesn't exist` }
          })
        }
        //Save the response from the request to "res.data"
        res.data = data
        next()
      })
      .catch(next)
  })
  /* -------------------

    G E T: get row by ID

     ------------------- */
  .get((req, res, next) => {
    //SAVE TABLE
    const table = req.app.get('table');
    // choose which function needs to be called so the
    // data can be serialized
    const serializeFunction = chooseSerialize(table);
    res.json(serializeFunction(res.data))
  })
  /* -------------------

    D E L E T E: delete row by id

     ------------------- */
  .delete((req, res, next) => {
    ScheduleService.deleteData(
      req.app.get('db'),
      req.app.get('table'),
      req.params.data_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  /* -------------------

    P A T C H: update row by id

     ------------------- */
  .patch(jsonParser, (req, res, next) => {
    //const { title, content, style } = req.body
    const dataToUpdate = req.body; //{ title, content, style }

    const numberOfValues = Object.values(dataToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'style' or 'content'`
        }
      })

    ScheduleService.updateData(
      req.app.get('db'),
      req.app.get('table'),
      req.params.data_id,
      dataToUpdate
    )
    .then(numRowsAffected => {
        res.
        status(204).end()
      })
      .catch(next)
  })


   /*
 ------------ MASS GRAB OF DATA BY ID
 */
scheduleRouter
.route('/business/:business_id')
/* -------------------
  Requesting data by business_ID: save to "res.data" for any 
    endpoints to use
   ------------------- */
.all((req, res, next) => {
  ScheduleService.getByBusinessId(
    req.app.get('db'),
    req.app.get('table'),
    req.params.business_id
  )
    .then(data => {
      if (!data) {
        return res.status(404).json({
          error: { message: `data doesn't exist` }
        })
      }
      //Save the response from the request to "res.data"
      res.data = data
      next()
    })
    .catch(next)
})
/* -------------------

  G E T: get row by BUSINESS_ID

   ------------------- */
.get((req, res, next) => {
  //SAVE TABLE
  const table = req.app.get('table');
  // choose which function needs to be called so the
  // data can be serialized
  console.log(res.data)
  const serializeFunction = chooseSerialize(table);
  //MUST map through the list and serialize each object and return
  // the serialized object to "res.json()"
  res.json(res.data.map(obj => {
    return serializeFunction(obj);
  }))
})
/* -------------------

    D E L E T E: delete row by BUSINESS_ID

     ------------------- */
.delete((req, res, next) => {
    ScheduleService.deleteBusinessData(
        req.app.get('db'),
        req.app.get('table'),
        req.params.business_id
    )
      .then(numRowsAffected => {
          res.status(204).end()
      })
      .catch(next)
    })

module.exports = scheduleRouter;