function business() {
    return [
    {   id: 1,
        business_name: 'Chick-Fil-A' 
    },
    {   id: 2,
        business_name: 'Mighty Fine'
    },
    {   id: 3,
        business_name: 'Wendys'
    },
    {   id: 4,
        business_name: 'Construction LLC'
    }
];
}
	
////////////////////////////////////////////////////////////


function employees(){
    return [
    { name: 'John Diggle',
      availability: 'FT',
      manager: false
    },
    { name: 'Bruce Wayne',
      availability: 'FT',
      manager: false
    },
    { name: 'Flash Gordon',
      availability: 'FT',
      manager: false
    },
    { name: 'Skip Bayless',
      availability: 'FT',
      manager: false
    },
    { name: 'Gordon Ramsy',
      availability: 'FT',
      manager: true
    },
    { name: 'Jimmy Garropolo',
      availability: 'PT',
      manager: false
    },
  ]
}

  ////////////////////////////////////////////////////////////
  
  function dayLabor(){
    return [
    { 
        time: '5AM',
        sunday: '0',
        monday: '1',
        tuesday: '1',
        wednesday: '1',
        thursday: '1',
        friday: '1',
        saturday: '0'
    },
    { 
        time: '6AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '7AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '8AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '9AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '10AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '11AM',
        sunday: '2',
        monday: '0',
        tuesday: '0',
        wednesday: '0',
        thursday: '0',
        friday: '0',
        saturday: '2'
    },
]
}

////////////////////////////////////////////////////////////

function operationHours(){
    return [
    { 
        day: 'Sunday',
        open: '6AM',
        close: '11AM'
    },
    { 
        day: 'Monday',
        open: '5AM',
        close: "10AM"
    },
    { 
        day: 'Tuesday',
        open: '5AM',
        close: '10AM'
    },
    { 
        day: 'Wednesday',
        open: '5AM',
        close: '10AM'
    },
    { 
        day: 'Thursday',
        open: '5AM',
        close: '10AM'
    },
    { 
        day: 'Friday',
        open: '5AM',
        close: '10AM'
    },
    { 
        day: 'Saturday',
        open: '6AM',
        close: '11AM'
    },
]
}


function maliciousBusiness() {
    const maliciousBusiness = {
           id: 1,
           business_name: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.' 
    }

    const expectedBusiness = {   
        id: 1,
        business_name: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.' 
    }
    
    return {
        maliciousBusiness,
        expectedBusiness,
    }

}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

module.exports = { operationHours, dayLabor, employees, business, maliciousBusiness }