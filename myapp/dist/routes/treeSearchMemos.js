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
const treeSearchUtils_1 = require("../utils/treeSearchUtils");
function printTree(node, depth = 0) {
    // ノードがnullでないことを確認
    if (!node)
        return;
    // 現在のノードの情報をインデントを用いて出力
    console.log(`${' '.repeat(depth * 2)}ノード: ${node.node.title}`);
    // 子ノードがある場合、それぞれの子ノードに対して再帰的にこの関数を呼び出す
    if (node.children && node.children.length > 0) {
        console.log(`${' '.repeat(depth * 2)} 子ノード:`);
        node.children.forEach(child => printTree(child, depth + 1));
    }
}
const router = express_1.default.Router();
// ベクトル検索結果
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    try {
        const result = yield (0, treeSearchUtils_1.performVectorSearchTree)(query);
        // ツリー構造をコンソールに出力
        printTree(result);
        res.render('treeSearchDisplay', { memos: result }); // 結果を表示画面に再利用
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
