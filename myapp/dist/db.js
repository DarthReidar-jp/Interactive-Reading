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
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new mongodb_1.MongoClient(uri);
let dbInstance = null; // dbInstance をDb型またはnull型で初期化
// MongoDB データベースへの接続を管理する関数
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // 既に接続が確立されている場合、既存の接続を再利用
        if (dbInstance) {
            return dbInstance;
        }
        try {
            // MongoDB データベースに接続を試みる
            yield client.connect();
            // 接続が成功した場合、データベース名 "knowledge" を指定して dbInstance を設定
            dbInstance = client.db("buddism-IT");
            return dbInstance; // dbInstance を返してアプリケーション内で使用可能にする
        }
        catch (error) {
            // エラーハンドリング: 接続中にエラーが発生した場合
            console.error("MongoDBに接続中にエラーが発生しました:", error);
            throw error; // エラーを再スローしてハンドリングできるようにする
        }
    });
}
exports.default = connectDB; // connectDB 関数をモジュールとしてエクスポート
