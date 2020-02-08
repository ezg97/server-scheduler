//  --- requirements ---
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config');
const scheduleRouter = require('./schedule/schedule-router');

//  --- middleware ---
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function tableHeader(req, res, next){
  //grab the table from the header
  const table = req.get('table');
  
  console.log('started')
  console.log('table',table);
  
  app.set('table', table);
  
      // move to the next middleware
  next();
});


//  --- endpoints ---
app.get('/', (req, res,next) => {
    res.send('Hello, world!')
});

app.use(scheduleRouter);



app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  

//  --- export ---
module.exports = app;

/*app.get('/st', (req,res,next) => {
    ScheduleService.getInfo(req.app.get('db'))
      .then(info => {
        if (!info) {
          logger.error(`No info found.`)
          return res.status(404).json({
            error: { message: `Info Not Found` }
          })
        }
        res.json(info)
      })
      .catch(next)
})*/