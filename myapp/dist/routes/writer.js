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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb"); // MongoDBドライバーからObjectIdをインポート
const dbUtils_1 = require("../utils/dbUtils");
const router = express_1.default.Router();
// Book新規作成画面の表示
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render('writer');
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        }
        else {
            res.status(500).send(String(e));
        }
    }
}));
// タイトル入力時にBookを作成するエンドポイント
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const collection = yield (0, dbUtils_1.getDBCollection)('books');
        const result = yield collection.insertOne({ title: title });
        if (result.acknowledged) {
            // res.redirectの代わりに、生成されたbookIdをクライアントに返す
            res.json({ bookId: result.insertedId.toString() });
        }
        else {
            res.status(500).send('Bookの作成に失敗しました。');
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        }
        else {
            res.status(500).send(String(e));
        }
    }
}));
// Book執筆画面を表示
router.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        // パラメータから取得したbookIdを使用してMongoDBのObjectIdを生成
        const objectId = new mongodb_1.ObjectId(bookId);
        const collection = yield (0, dbUtils_1.getDBCollection)('books');
        // 指定されたIDを持つBookをデータベースから検索
        const book = yield collection.findOne({ _id: objectId });
        if (book) {
            res.render('writer', { book });
        }
        else {
            res.status(404).send('Book not found');
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        }
        else {
            res.status(500).send(String(e));
        }
    }
}));
// 本の編集
router.post('/edit/:bookid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const collection = yield (0, dbUtils_1.getDBCollection)('books');
        //ここらへんでマークダウンの処理しなくていいの？
        yield collection.updateOne({ _id: new mongodb_1.ObjectId(req.params.bookid) }, { $set: { title, content } });
        res.redirect(`/writer/${req.params.bookid}`);
    }
    catch (e) {
        if (e instanceof Error) {
            // eがErrorインスタンスである場合、そのmessageプロパティを使用
            res.status(500).send(e.message);
        }
        else {
            // eがErrorインスタンスではない場合（文字列など）、toStringで変換
            res.status(500).send(String(e));
        }
    }
}));
exports.default = router;
