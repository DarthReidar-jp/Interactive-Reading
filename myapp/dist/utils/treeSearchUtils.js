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
exports.performVectorSearchTree = void 0;
const dbUtils_1 = require("./dbUtils");
const openaiUtils_1 = require("./openaiUtils");
function findRootNode(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryVector = yield (0, openaiUtils_1.getQueryVector)(query);
            if (!Array.isArray(queryVector) || !queryVector.every(v => typeof v === 'number')) {
                throw new Error('getQueryVector returned an invalid format. Expected an array of numbers.');
            }
            const collection = yield (0, dbUtils_1.getDBCollection)('memos');
            console.log("ルートノードの取得開始");
            const agg = [
                {
                    '$vectorSearch': {
                        'index': 'vector_index',
                        'path': 'vector',
                        'queryVector': queryVector,
                        'numCandidates': 1000,
                        'limit': 1
                    }
                },
                {
                    '$project': {
                        'title': 1,
                        'content': 1,
                        'vector': 1,
                        'score': { '$meta': 'vectorSearchScore' }
                    }
                },
                {
                    '$match': {
                        'score': { '$gte': 0.7 }
                    }
                }
            ];
            const result = yield collection.aggregate(agg).toArray();
            console.log("ルートノードの取得完了", result);
            // クエリと最も類似度が高いメモを返す
            return result[0] || null;
        }
        catch (e) {
            console.error("Error finding root node:", e);
            throw e;
        }
    });
}
function buildTree(node, ancestors, depth = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`深さ: ${depth}, 処理中のノード: ${node.title} (${node._id})`);
        // 終了条件
        if (!node || depth > 5 || (ancestors.length >= 3 && ancestors.slice(-3).every(val => val._id === node._id))) {
            console.log(`深さ ${depth} で終了条件に達しました。`);
            return null;
        }
        try {
            const collection = yield (0, dbUtils_1.getDBCollection)('memos');
            const queryVector = node.vector;
            if (!Array.isArray(queryVector) || !queryVector.every(v => typeof v === 'number')) {
                console.error("ノード内の queryVector の形式が無効です:", node);
                throw new Error('queryVector の形式が無効です。配列の数値が期待されます。');
            }
            // Limit計算アルゴリズム（今後修正予定）
            let limit = 2;
            if (depth == 1) {
                limit = 3;
            }
            else if (depth > 1) {
                // 3階層目以降の計算式を修正
                limit = depth + 2;
            }
            console.log(`深さ: ${depth}, ノードの取得制限: ${limit}`);
            const agg = [
                {
                    '$vectorSearch': {
                        'index': 'vector_index',
                        'path': 'vector',
                        'queryVector': queryVector,
                        'numCandidates': 1000,
                        'limit': limit,
                    }
                },
                {
                    '$project': {
                        'title': 1,
                        'content': 1,
                        'vector': 1,
                        'score': { '$meta': 'vectorSearchScore' }
                    }
                },
                {
                    '$sort': { 'score': -1 }
                }
            ];
            const results = yield collection.aggregate(agg).toArray();
            console.log(`クエリの結果、${results.length} 個の潜在的な子ノードが見つかりました。`);
            // 自身と先祖のIDを除外
            const excludedIds = [node._id, ...ancestors.map(a => a._id)]
                .filter(id => id !== undefined) // _idがundefinedでないものだけをフィルタリング
                .map(id => id.toString()); // _idがundefinedでないと確認できたので、非nullアサーション(!)を使用してtoString()を呼び出す
            console.log(`除外するノードのID: ${excludedIds.join(', ')}`);
            // 自身と先祖のフィルタリング
            const filteredResults = results.filter(doc => doc._id !== undefined && !excludedIds.includes(doc._id.toString()));
            console.log(`自身と先祖を除外した後、${filteredResults.length} 個の子ノードにフィルタリングされました。`);
            // スコアで降順にソートし、上位2つのドキュメントのみを選択
            const topTwoResults = filteredResults.slice(0, 2);
            console.log(`スコアに基づいて上位2つの子ノードが選択されました。`);
            // 子ノードに対して再帰的に処理
            const children = [];
            for (const r of topTwoResults) {
                console.log(`子ノードの処理中: ${r.title} (${r._id}) - スコア: ${r.score}`);
                if (r.score < 0.7)
                    break; // スコアの閾値をチェック
                const childTree = yield buildTree(r, [...ancestors, node], depth + 1);
                if (childTree) {
                    console.log(`子ノードの追加に成功しました: ${r.title} (${r._id})`);
                    children.push(childTree);
                }
            }
            return {
                node,
                children
            };
        }
        catch (e) {
            console.error("ツリーの構築中にエラーが発生しました:", e);
            throw e; // エラーを再スロー 
        }
    });
}
// ベクトル検索に基づく系統樹構築を開始する関数
function performVectorSearchTree(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let root = yield findRootNode(query); // ルートノードを見つける
            if (!root)
                return null; // ルートノードが見つからない場合はnullを返す
            let tree = yield buildTree(root, []); // 系統樹を構築する
            return tree;
        }
        catch (e) {
            // エラーがErrorインスタンスかどうかをチェック
            if (e instanceof Error) {
                throw new Error(e.message);
                console.error("Error performing vector search tree:", e);
                return null; // エラーが発生した場合はnullを返す
            }
            else {
                throw new Error(String(e));
            }
        }
    });
}
exports.performVectorSearchTree = performVectorSearchTree;
