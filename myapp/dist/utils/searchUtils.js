"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performVectorSearch = void 0;
const dbUtils_1 = require("./dbUtils");
const openaiUtils_1 = require("./openaiUtils");
function performVectorSearch(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryVector = yield (0, openaiUtils_1.getQueryVector)(query);
        const collection = yield (0, dbUtils_1.getDBCollection)('memos');
        const agg = [
            {
                '$vectorSearch': {
                    'index': 'vector_index',
                    'path': 'vector',
                    'queryVector': queryVector,
                    'numCandidates': 100,
                    'limit': 10
                }
            },
            {
                '$project': {
                    'title': 1,
                    'content': 1,
                    'score': { '$meta': 'vectorSearchScore' }
                }
            },
            {
                '$match': {
                    'score': { '$gte': 0.7 }
                }
            },
            {
                '$sort': { 'score': -1 }
            }
        ];
        return yield collection.aggregate(agg).toArray();
    });
}
exports.performVectorSearch = performVectorSearch;
