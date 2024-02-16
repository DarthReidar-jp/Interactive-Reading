// 環境変数をプロセスにロード
import dotenv from 'dotenv';
dotenv.config();

// 必要なモジュールをインポート
import createError from 'http-errors';
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// ルーターモジュールをインポート
import indexRouter from './routes/index';
import displayMemos from './routes/displayMemos';
import importMemos from './routes/importMemos';
import searchMemos from './routes/searchMemos';
import treeSearchMemos from './routes/treeSearchMemos';
import folders from './routes/folders';
import createRouter from './routes/create';
import detailRouter from './routes/detail';
import writerRouter from './routes/writer';
import editBookRoter from './routes/editBook';

const app: Express = express(); // Express アプリケーションを作成

// ビューエンジンの設定
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

// ミドルウェアの設定
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));// URLエンコードされたボディのサイズ制限を増やす
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));


// ルーターの設定
app.use('/', indexRouter);
app.use('/display', displayMemos);
app.use('/import', importMemos);
app.use('/folders', folders);
app.use('/search', searchMemos);
app.use('/treeSearch', treeSearchMemos);
app.use('/create', createRouter);
app.use('/detail', detailRouter);
app.use('/writer',writerRouter);
app.use('/book' ,editBookRoter);

// 404 エラーのハンドリング
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// エラーハンドリング
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
