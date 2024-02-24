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
// routes/detail.ts
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const openaiUtils_1 = require("../utils/openaiUtils");
const dbUtils_1 = require("../utils/dbUtils");
const router = express_1.default.Router();
// メモの詳細を表示
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield (0, dbUtils_1.getDBCollection)('memos');
        const memo = yield collection.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        res.render('detail', { memo });
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
// メモの編集とエンベディングの更新を処理
router.post('/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    try {
        const collection = yield (0, dbUtils_1.getDBCollection)('memos');
        const vector = yield (0, openaiUtils_1.getMemoVector)(content);
        yield collection.updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: { title, content, vector } });
        res.redirect(`/detail/${req.params.id}`);
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
// 削除
router.post('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('削除リクエスト受信:', req.params.id);
        const collection = yield (0, dbUtils_1.getDBCollection)('memos');
        yield collection.deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        res.redirect('/display');
    }
    catch (e) {
        if (e instanceof Error) {
            // eがErrorインスタンスである場合、そのmessageプロパティを使用
            res.status(500).send(e.message);
            console.error('削除中のエラー:', e);
        }
        else {
            // eがErrorインスタンスではない場合（文字列など）、toStringで変換
            res.status(500).send(String(e));
        }
    }
}));
exports.default = router;
