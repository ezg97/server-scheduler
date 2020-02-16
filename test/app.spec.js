const knex = require('knex');

const fixtures = require('./anytime-fixtures');


const app = require('../src/app');


describe('Anytime Scheduler Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())


    before('cleanup', () => db('operation').truncate())

    before('cleanup', () => db('business').truncate())


    afterEach('cleanup', () => db('operation').truncate())

    afterEach('cleanup', () => db('business').truncate())
    

    /* ------------------------

              GET / 
              
      ------------------------ */
    describe('App', () => {
        it('GET / responds with 200 containing "Hello, world!"', () => {
          return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!')
        })
    })


    /* ------------------------

              GET /all 

      ------------------------ */
    describe('GET /all', () => {

        /* -----------------------
              - BUSINESS: Empty Table    
      ------------------------ */
        context(`BUSINESS: no table given`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/all')
              .set('table', `business`)
              .expect(200, [])
          })
        })

        /* -----------------------
              - BUSINESS: Full Table    
      ------------------------ */
        context('BUSINESS: Given if there are businesses in the database', () => {
          const testBusiness = fixtures.business();

          beforeEach('insert businesses', () => {
            return db
              .into('business')
              .insert(testBusiness)
          })

          it('gets the business from the store', () => {
            return supertest(app)
              .get('/all')
              .set('table', `business`)
              .expect(200, testBusiness)
          })
        })


        /* -----------------------
              - OPERATION: Empty Table    
      ------------------------ *//*
      context(`OPERATION: no table given`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get('/all')
            .set('table', `operation`)
            .expect(200, [])
        })
      })*/

      /* -----------------------
            - OPERATION: Full Table    
    ------------------------ *//*
      context('OPERATION: Given if there are operations in the database', () => {
        const testoperation = fixtures.operationHours();

        beforeEach('insert operation', () => {
          return db
            .into('operation')
            .insert(testoperation)
        })

        it('gets the business from the store', () => {
          return supertest(app)
            .get('/all')
            .set('table', `operation`)
            .expect(200, testoperation)
        })
      })
      */

    })

    /* -----------------------
              - BUSINESS: XSS Attack    
      ------------------------ */
    context(`BUSINESS: Given if there's an XSS attack`, () => {
      const { maliciousBusiness, expectedBusiness } = fixtures.maliciousBusiness()

        console.log(maliciousBusiness)

        beforeEach('insert malicious business', () => {
          return db
            .into('business')
            .insert([maliciousBusiness])
        })

        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/all`)
            .set('table', `business`)
            .expect(200)
            .expect(res => {
              console.log('XSS BODY *********:',res.body[0]);
              console.log('*************** EXPECTED: ',expectedBusiness)
              expect(res.body[0].business_name).to.eql(expectedBusiness.business_name)
            })
        })
      
    })
    /* ******************************************************************************* */




    /* ------------------------

              POST /all 

      ------------------------ */
      describe('POST /all', () => {
          /* -----------------------
                 - BUSINESS: Missing Business Name    
          ------------------------ */
          it(`responds with 400 missing 'name' if not supplied`, () => {
            const newBusinessMissingName = {
              // business_name: 'name',
            }
            return supertest(app)
              .post(`/all`)
              .send(newBusinessMissingName)
              .set('table', `business`)
              .expect(400, `Empty request body`)
          })
      /*
          it(`responds with 400 missing 'url' if not supplied`, () => {
            const newBookmarkMissingUrl = {
              title: 'test-title',
              // url: 'https://test.com',
              rating: 1,
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmarkMissingUrl)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(400, `'url' is required`)
          })
      
          it(`responds with 400 missing 'rating' if not supplied`, () => {
            const newBookmarkMissingRating = {
              title: 'test-title',
              url: 'https://test.com',
              // rating: 1,
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmarkMissingRating)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(400, `'rating' is required`)
          })
      
          it(`responds with 400 invalid 'rating' if not between 0 and 5`, () => {
            const newBookmarkInvalidRating = {
              title: 'test-title',
              url: 'https://test.com',
              rating: 'invalid',
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmarkInvalidRating)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(400, `'rating' must be a number between 0 and 5`)
          })
      
          it(`responds with 400 invalid 'url' if not a valid URL`, () => {
            const newBookmarkInvalidUrl = {
              title: 'test-title',
              url: 'htp://invalid-url',
              rating: 1,
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmarkInvalidUrl)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(400, `'url' must be a valid URL`)
          })
      
          it('adds a new bookmark to the store', () => {
            const newBookmark = {
              title: 'test-title',
              url: 'https://test.com',
              description: 'test description',
              rating: 1,
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmark)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(201)
              .expect(res => {
                expect(res.body.title).to.eql(newBookmark.title)
                expect(res.body.url).to.eql(newBookmark.url)
                expect(res.body.description).to.eql(newBookmark.description)
                expect(res.body.rating).to.eql(newBookmark.rating)
                expect(res.body).to.have.property('id')
              })
              .then(res =>
                supertest(app)
                  .get(`/bookmarks/${res.body.id}`)
                  .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                  .expect(res.body)
              )
          })
      
          it('removes XSS attack content from response', () => {
            const { maliciousBookmark, expectedBookmark } = fixtures.makeMaliciousBookmark()
            return supertest(app)
              .post(`/bookmarks`)
              .send(maliciousBookmark)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(201)
              .expect(res => {
                expect(res.body.title).to.eql(expectedBookmark.title)
                expect(res.body.description).to.eql(expectedBookmark.description)
              })
          })*/
        })
        /* ******************************************************************************* */




    /* ------------------------

              G E T /:data_id 

      ------------------------ */
      describe('GET /data_id', () => {

          /* -----------------------
                 - BUSINESS: Id doesn't exist    
          ------------------------ */
          context(`BUSINESS: Given if id doesn't exist`, () => {
            it(`responds 404 when business doesn't exist`, () => {
              return supertest(app)
                .get(`/123`)
                .set('table', `business`)
                .expect(404, {
                  error: { message: `Data Not Found` }
                })
            })
          })
          
          /* -----------------------
                 - BUSINESS: Id exists   
          ------------------------ */
          context('BUSINESS: Given if id exists', () => {
            const testBusiness = fixtures.business()
      
            beforeEach('insert business', () => {
              return db
                .into('business')
                .insert(testBusiness)
            })
      
            it('responds with 200 and the specified business', () => {
              const businessId = 2
              const expectedBusiness = testBusiness[businessId - 1]
              return supertest(app)
                .get(`/${businessId}`)
                .set('table', `business`)
                .expect(200, expectedBusiness)
            })
          })
      
          /* -----------------------
                 - BUSINESS: XSS attack    
          ------------------------ */
          context(`BUSINESS: Given if there's an XSS attack`, () => {
            const { maliciousBusiness, expectedBusiness } = fixtures.maliciousBusiness()
      
            beforeEach('insert malicious business', () => {
              return db
                .into('business')
                .insert([maliciousBusiness])
            })
      
            it('removes XSS attack content', () => {
              return supertest(app)
                .get(`/${maliciousBusiness.id}`)
                .set('table', `business`)
                .expect(200)
                .expect(res => {
                  expect(res.body.business_name).to.eql(expectedBusiness.business_name)
                })
            })
          })
      })
      /* ******************************************************************************* */




    /* ------------------------

              D E L E T E /:data_id 

      ------------------------ */
      describe('DELETE /:data_id', () => {

        /* -----------------------
                 - BUSINESS: Id doesn't exist    
          ------------------------ */
          context(`BUSINESS: Given if id doesn't exist`, () => {
            it(`responds 404 whe business doesn't exist`, () => {
              return supertest(app)
                .delete(`/123`)
                .set('table', `business`)
                .expect(404, {
                  error: { message: `Data Not Found` }
                })
            })
          })

          /* -----------------------
                 - BUSINESS: Id exists    
          ------------------------ */
          context('BUSINESS: Given if ID exists', () => {
            const testBusiness = fixtures.business()
      
            beforeEach('insert business', () => {
              return db
                .into('business')
                .insert(testBusiness)
            })
      
            it('removes the business by ID from the store', () => {
              const idToRemove = 2
              const expectedBusiness = testBusiness.filter(bs => bs.id !== idToRemove)
              return supertest(app)
                .delete(`/${idToRemove}`)
                .set('table', `business`)
                .expect(204)
                .then(() =>
                  supertest(app)
                    .get(`/all`)
                    .set('table', `business`)
                    .expect(expectedBusiness)
                )
            })
          })
      })
      /* ******************************************************************************* */




    /* ------------------------

              P A T C H /:data_id 

      ------------------------ */
      describe('PATCH /:data_id', () => {

        /* -----------------------
                 - BUSINESS: Id doesn't exist   
          ------------------------ */
        context(`BUSINESS: Given if id doesn't exist`, () => {
          it(`responds 404 whe business doesn't exist`, () => {
            return supertest(app)
              .patch(`/255`)
              .send( { business_name: "Chocolate" } )
              .set('table', `business`)
              .expect(404, {
                error: { message: `Data Not Found` }
              })
          })
        })

        /* -----------------------
                 - BUSINESS: Id exists   
          ------------------------ */
          context('BUSINESS: Given if ID exists', () => {
            const testBusiness = fixtures.business()

            beforeEach('insert business', () => {
              return db
                .into('business')
                .insert(testBusiness)
            })

            it('Updates the business by ID from the store', () => {
              //chose id to update
              const idToUpdate = 2;
              //create revision data
              const revision={ 'business_name': "Chocolate" }
              //locate and store the data related to the id
              let expectedBusiness = testBusiness.filter(bs => bs.id === idToUpdate);
              //secure the id from the list
              expectedBusiness = expectedBusiness[0];
              //use the spread operator to combine the "expected info" with the "revised info"
              expectedBusiness = {...expectedBusiness, ... revision};


              return supertest(app)
                .patch(`/${idToUpdate}`)
                .send( revision )
                .set('table', `business`)
                .expect(204)
                .then(() =>
                  supertest(app)
                    .get(`/${idToUpdate}`)
                    .set('table', `business`)
                    .expect(expectedBusiness)
                )
            })
          })
    })


      
      /* ******************************************************************************* */




    /* ------------------------

              G E T /business/:business_id 

      ------------------------ */
      /*
      describe('GET /business/:business_id', () => {
        //every table besides business has a business id endpoint
        
        context(`BUSINESS: Given if business_id doesn't exist`, () => {
          it(`responds 404 when business doesn't exist`, () => {
            return supertest(app)
              .get(`/123`)
              .set('table', `business`)
              .expect(404, {
                error: { message: `Data Not Found` }
              })
          })
        })
    
        context('BUSINESS: Given if id exists', () => {
          const testBusiness = fixtures.business()
    
          beforeEach('insert business', () => {
            return db
              .into('business')
              .insert(testBusiness)
          })
    
          it('responds with 200 and the specified business', () => {
            const businessId = 2
            const expectedBusiness = testBusiness[businessId - 1]
            return supertest(app)
              .get(`/${businessId}`)
              .set('table', `business`)
              .expect(200, expectedBusiness)
          })
        })
    
        context(`BUSINESS: Given if there's an XSS attack`, () => {
          const { maliciousBusiness, expectedBusiness } = fixtures.maliciousBusiness()
    
          beforeEach('insert malicious business', () => {
            return db
              .into('business')
              .insert([maliciousBusiness])
          })
    
          it('removes XSS attack content', () => {
            return supertest(app)
              .get(`/${maliciousBusiness.id}`)
              .set('table', `business`)
              .expect(200)
              .expect(res => {
                expect(res.body.business_name).to.eql(expectedBusiness.business_name)
              })
          })
        })
    })
    */
      /* ******************************************************************************* */




    /* ------------------------

              D E L E T E /business/:business_id 

      ------------------------ */
      /*
      describe('DELETE /:data_id', () => {
        //only business doesn't have this endpoinht
        context(`BUSINESS: Given if id doesn't exist`, () => {
          it(`responds 404 whe business doesn't exist`, () => {
            return supertest(app)
              .delete(`/123`)
              .set('table', `business`)
              .expect(404, {
                error: { message: `Data Not Found` }
              })
          })
        })
    })
    */

});