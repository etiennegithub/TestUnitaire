import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import chaiNock from 'chai-nock';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import nock from 'nock';

import server from '../server';
import resetDatabase from '../utils/resetDatabase';

chai.use(chaiHttp);
chai.use(chaiNock);
chai.use(chaiAsPromised);

// tout les packages et fonction nescessaire au test sont importé ici, bon courage

// fait les Tests d'integration en premier

// describe('Books', () => {
//     beforeEach((done) => {
//         Book.remove({}, (err) => { 
//            done();
//         });
//     });


//const nock = require('nock')



const pathBooks = path.join(__dirname, '../data/books.json');

describe('/GET book', () => {
    beforeEach(() => {
        resetDatabase(pathBooks, {"books":[]})
    })
    
    it('it should GET books correctly', (done) => {
      chai.request(server)
          .get('/book')
          .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body.books).to.be.an('array');
              expect(res.body.books.length).to.equal(0);
              //console.log(res.body.book.title);
            done();
          });
    });
});

describe('/POST book', () => {

    it('it should POST books correctly', (done) => {

      chai.request(server)
          .post('/book')
          .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body.message).to.have.string('book successfully added');
              done();
          });
    });
});

describe('/PUT/:id book', () => {
    beforeEach(() => {
        resetDatabase(pathBooks, {"books":[
            { id: '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
            title: 'Coco raconte Channel 2',
            years: 1990,
            pages: 400
        }
    ]})
     nock("http://localhost:8080")
    .put('/book/' + '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
    .reply(200, {
        message: "book successfully updated"
    })

    })

    it('it should UPDATE a book with id correctly', (done) => {

        chai.request("http://localhost:8080")
        .put('/book/' + '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.have.string('book successfully updated');
            console.log("message : " + res.body.message);
            done();
        });
    });
});

describe('/DELETE/:id book', () => {
    beforeEach(() => {
        resetDatabase(pathBooks, {"books":[
            { id: '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
            title: 'Coco raconte Channel 2',
            years: 1990,
            pages: 400
        }
    ]})
    nock("http://localhost:8080")
    .delete('/book/' + '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
    .reply(200, {
        message: "book successfully deleted"
    })

    })

    it('it should DELETE a book with id correctly', (done) => {

        chai.request("http://localhost:8080")
        .delete('/book/' + '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.have.string('book successfully deleted');
            done();
        });
    });
});

describe('/GET/:id book', () => {
    beforeEach(() => {
    //     resetDatabase(pathBooks, {"books":[
    //         { id: '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
    //         title: 'Coco raconte Channel 2',
    //         years: 1990,
    //         pages: 400
    //     }
    // ]})
    nock("http://localhost:8080")
    .get('/book/' + '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
    .reply(200, {
        "message" : "book fetched",
        "book" : {
            id: '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
            title: 'Coco raconte Channel 2',
            years: 1990,
            pages: 400
        }
        
    })

    })

    it('it should GET a book with id correctly', (done) => {

        chai.request("http://localhost:8080")
        .get('/book/' + '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.have.string('book fetched');
            expect(res.body).is.an('object');
            expect(res.body.book.title).to.be.a('string');
            expect(res.body.book.title).equal('Coco raconte Channel 2');
            expect(res.body.book.years).to.be.a('number');
            expect(res.body.book.years).equal(1990);
            expect(res.body.book.pages).to.be.a('number');
            expect(res.body.book.pages).equal(400);
            done();
        });
    });
});



