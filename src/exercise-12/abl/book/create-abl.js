const LibraryDao = require('../../dao/library-dao');
const { createBookSchema } = require('../../schemas/book-schemas');

const dao = new LibraryDao();

async function CreateAbl(body, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(createBookSchema, body);

    if (!valid) {
        return res.status(400).json({ error: ajv.errors });
    }

    const { code, name, author } = body;
    if (!code || !name || !author) {
        return res.status(400).json({ error: 'Invalid input: code, name, or author parameter is missing' });
    }

    const book = { code, name, author };

    try {
        await dao.createBook(book);
        res.status(201).json(book);
    } catch (error) {
        if (error.message === 'DUPLICATE_CODE') {
            return res.status(400).json({ error: 'Book with the same code already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = CreateAbl;
