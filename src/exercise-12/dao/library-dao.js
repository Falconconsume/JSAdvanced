const fs = require('fs').promises;
const path = require('path');

const DEFAULT_STORAGE_PATH = path.join(__dirname, '..', 'storage', 'books.json');

class LibraryDao {
    constructor(storagePath) {
        this.bookStoragePath = storagePath || DEFAULT_STORAGE_PATH;
    }

    async createBook(book) {
        try {
            let existingBooks = await this.readBooks();
            const isDuplicate = this._isDuplicate(existingBooks, book.code);
            if (isDuplicate) {
                throw new Error("DUPLICATE_CODE");
            }
            existingBooks.push(book);
            await fs.writeFile(this.bookStoragePath, JSON.stringify(existingBooks, null, 2), 'utf8');
        } catch (error) {
            console.error("Error creating book:", error);
            throw error; // Propagate the error for proper handling in the caller
        }
    }

    async getBook(code) {
        try {
            const existingBooks = await this.readBooks();
            const foundBook = existingBooks.find(book => book.code === code);
            return foundBook;
        } catch (error) {
            console.error("Error getting book:", error);
            throw error; // Propagate the error for proper handling in the caller
        }
    }

    async readBooks() {
        try {
            const data = await fs.readFile(this.bookStoragePath, 'utf8');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            console.error("Error reading books:", error);
            throw error; // Propagate the error for proper handling in the caller
        }
    }

    _isDuplicate(books, code) {
        return books.some(b => b.code === code);
    }
}

module.exports = LibraryDao;
