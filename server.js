//////////////////////////////setup//////////////////////////////////////

const express = require('express');
require('dotenv').config();
const superagent = require('superagent');

const PORT = process.env.PORT || 5000;
const server = express();

const meethodOverride = require('method-override')
server.use(meethodOverride('-method'))

const cors = require('cors');
server.use(cors());

const pg = require('pg')
//const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const client = new pg.Client(process.env.DATABASE_URL)

server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

// server.get('/',(req,res) => {
//     res.render('pages/index');
// })


// server.get('/search',(req,res) => {
//     let bookname =req.query.searchBook;
//     let select =req.query.sort;
//     let url = `https://www.googleapis.com/books/v1/volumes?q=${bookname}+${select}:keyes`

//     superagent.get(url).then(BooksData => {
//         let bookarr =BooksData.body.items.map(value => {
//             return new Book(value)
//         })
//         res.render('pages/searches/show',{booksARR:bookarr})
//     })
// })

// server.listen(PORT,()=> {
//     console.log(`hi  ${PORT}`);
// })




// function Book(DATA) {
//     this.imgurl=DATA.volumeInfo.imageLinks.smallhumbnail;
//     this.title=DATA.volumeInfo.title;
//     this.authors=DATA.volumeInfo.authors;
//     this.description =DATA.volumeInfo.description;

// }


////////////  routes  /////////
server.get('/', homeHandler)
server.get('/searches', formHandler)
server.post('/searches/new', infoHandler)
server.post('/addbook', addHandler)
server.get('/books/:id', detailHandler)
server.put('/books/:id', udatehandler)



////// home handnler ////

function homeHandler(req, res) {
    let SQL = `SELECT * FROM book`
    client.query(SQL).then(result => {
        console.log(result.rows);
        res.render(`pages/index`, { homedata: result.rows })

    })
}

function formHandler(req, res) {
    res.render('pages/searches/new');
}

function infoHandler(req, res) {
    let bookname = req.query.searchBook;
    let select = req.query.sort;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${bookname}+${select}:keyes`

    superagent.get(url).then(BooksData => {
        let bookarr = BooksData.body.items.map(value => {
            return new Books(value)
        })
        res.render('pages/searches/show', { booksARR: bookarr })
    })
}


function addHandler(req, res) {
    let SQL = `INSERT INTO book(title,author,isbn,image_url,description) VALUES ($1,$2,$3,$4,$5)RETURNING id;`
    let Body = req.body
    let safeValues = [Body.title, Body.author, Body.isbn, Body.image_url, Body.description]

    client.query(SQL, safeValues)
        .then(() => {
            res.redirect('/')
        })
}


function detailHandler(req, res) {
    // console.log(req.params)
    let SQL = `SELECT * FROM book WHERE id=$1;`
    let safeValues = [req.params.id]
    console.log(safeValues)
    client.query(SQL, safeValues)
        .then(result => {
            res.render('pages/books/detail', { detalobj: result.rows[0] })
        })
}



function Books(bookdata) {
    if (bookdata.volumeInfo.imageLinks !== undefined) {
        this.imgUrl = bookdata.volumeInfo.imageLinks.smallThumbnail;
    } else {
        this.imgUrl = ' ';
    }

    this.title = bookdata.volumeInfo.title;
    this.author = bookdata.volumeInfo.authors;
    this.isbn = bookdata.volumeInfo.industryIdentifiers[0].type + bookdata.volumeInfo.industryIdentifiers[0].identifier
    this.description = bookdata.volumeInfo.description
}




function udatehandler(req, res) {

    let { title, author, isbn, image_url, description } = req.body

    let SQL = `UPDATE book SET title=$1,author=$2,isbn=$3,image_url=$4,description=$5 WHERE id=$6;`
    let safeValues = [title, author, isbn, image_url, description, req.params.id]
    client.query(SQL, safeValues)
        .then(() => {
            res.redirect(`/books/${req.params.id}`)
        })
}
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Listening to Port ${PORT}`)
        });
    });
