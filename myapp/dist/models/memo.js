"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memo = void 0;
class Memo {
    constructor(title = '', content = '', vector) {
        this.title = title;
        this.content = content;
        this.vector = vector;
        this.folderIds = [];
        this.score = 0;
    }
}
exports.Memo = Memo;
