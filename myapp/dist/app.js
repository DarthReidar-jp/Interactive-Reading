"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 環境変数をプロセスにロード
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 必要なモジュールをインポート
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
// ルーターモジュールをインポート
const index_1 = __importDefault(require("./routes/index"));
const displayMemos_1 = __importDefault(require("./routes/displayMemos"));
const importMemos_1 = __importDefault(require("./routes/importMemos"));
const searchMemos_1 = __importDefault(require("./routes/searchMemos"));
const treeSearchMemos_1 = __importDefault(require("./routes/treeSearchMemos"));
const folders_1 = __importDefault(require("./routes/folders"));
const create_1 = __importDefault(require("./routes/create"));
const detail_1 = __importDefault(require("./routes/detail"));
const app = (0, express_1.default)(); // Express アプリケーションを作成
// ビューエンジンの設定
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');
// ミドルウェアの設定
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
// ルーターの設定
app.use('/', index_1.default);
app.use('/display', displayMemos_1.default);
app.use('/import', importMemos_1.default);
app.use('/folders', folders_1.default);
app.use('/search', searchMemos_1.default);
app.use('/treeSearch', treeSearchMemos_1.default);
app.use('/create', create_1.default);
app.use('/detail', detail_1.default);
// 404 エラーのハンドリング
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// エラーハンドリング
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
