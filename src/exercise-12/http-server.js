const express = require('express');
const LibraryDao = require('./dao/library-dao');
const { getBookSchema, createBookSchema } = require('./schemas/book-schemas');
const GetAbl = require('./abl/book/get-abl');
const CreateAbl = require('./abl/book/create-abl');

const app = express();
const port = process.env.PORT || 3003;

const dao = new LibraryDao();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/book/get', async (req, res) => {
    await GetAbl(req.query, res);
});

app.post('/book/create', async (req, res) => {
    await CreateAbl(req.body, res);
});

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
