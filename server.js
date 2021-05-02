//////////////////////////////setup//////////////////////////////////////

const express = require('express');
require('dotenv').config();
const superagent = require('superagent');

const PORT=process.env.PORT || 5000;
const server = express();

const cors = require('cors');
server.use(cors());


server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine','ejs');

server.get('/',(req,res) => {
    res.render('pages/index');
})


server.get('/search',(req,res) => {
    let bookname =req.query.searchBook;
    let select =req.query.sort;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${bookname}+${select}:keyes`
    
    superagent.get(url).then(BooksData => {
        let bookarr =BooksData.body.items.map(value => {
            return new Book(value)
        })
        res.render('pages/searches/show',{booksARR:bookarr})
    })
})

server.listen(PORT,()=> {
    console.log(`hi  ${PORT}`);
})




function Book(DATA) {
    this.imgurl=DATA.volumeInfo.imageLinks.smallhumbnail;
    this.title=DATA.volumeInfo.title;
    this.authors=DATA.volumeInfo.authors;
    this.description =DATA.volumeInfo.description;

}