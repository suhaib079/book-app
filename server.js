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
    res.render('index');
})

// server.get('/mybooks',(req,res) => {
//     res.render('index');
// })

server.get('/serch',(req,res) => {
    let bookname =req.query.searchBook;
    let select =req.query.sort;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${bookname}+${select}:keyes`
    
    superagent.get(url).then(BooksData => {
        let bookarr =BooksData.body.items.map(value => {
            return new Book(value)
        })
        res.render('./pages/searches/serch',{booksARR:bookarr.body})
    })
})

server.listen(PORT,()=> {
    console.log(`hi  ${PORT}`);
})




function Book(bookData) {
    this.imgurl=bookData.volumeInfo.imageLinks.smallhumbnail;
    this.title=bookData.volumeInfo.title;
    this.authors=bookData.volumeInfo.authors;
    this.description =bookData.volumeInfo.description;

}