"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = void 0;
// folder.ts
class Folder {
    constructor(name, description = '', memoIds) {
        this.name = name;
        this.description = description;
        this.memoIds = memoIds;
    }
}
exports.Folder = Folder;
