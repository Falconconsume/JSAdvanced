// get-abl.js
const LibraryDao = require('../../dao/library-dao');
const { getBookSchema } = require('../../schemas/book-schemas');
const Ajv = require('ajv').default;
const dao = new LibraryDao();

async function GetAbl(query, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(getBookSchema, query);

    if (!valid) {
        return res.status(400).json({ error: ajv.errors });
    }

    const bookCode = query.code;
    if (!bookCode) {
        return res.status(404).json({ error: 'Invalid input: code parameter is missing' });
    }

    try {
        const book = await dao.getBook(bookCode);
        if (!book) {
            return res.status(404).json({ error: `Book with code ${bookCode} not found` });
        }
        res.json(book);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = GetAbl;
