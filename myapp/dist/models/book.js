"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
//models/book.ts
class Book {
    constructor(title = '') {
        this.title = title;
        this.content = '';
        this.vector = [];
    }
}
exports.Book = Book;
