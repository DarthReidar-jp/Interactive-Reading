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
const memo_1 = require("../models/memo"); // Memoモデルのインポート方法は、実際のモデルの定義によって異なる場合があります。
const dbUtils_1 = require("../utils/dbUtils");
const openaiUtils_1 = require("../utils/openaiUtils");
const router = express_1.default.Router();
// 新規作成画面
router.get('/', (req, res) => {
    res.render('create'); // 新規作成フォームのテンプレートを表示
});
// 新規メモの作成
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const vector = yield (0, openaiUtils_1.getMemoVector)(content);
        // Memoの型が正確には不明ですが、ここでは適切な型を持つと仮定します。
        const memo = new memo_1.Memo(title, content, vector);
        const collection = yield (0, dbUtils_1.getDBCollection)('memos');
        yield collection.insertOne(memo);
        res.redirect('/display'); // 作成後は表示画面にリダイレクト
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
