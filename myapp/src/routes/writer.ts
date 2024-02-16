import express, { Request, Response } from 'express';
import { Book } from '../models/book';
import { getAllFoldersAndMemos } from '../utils/dataFetchUtils';
import { getDBCollection } from '../utils/dbUtils';

const router = express.Router();

// 画面の表示
router.get('/', async (req: Request, res: Response) => {
    try {
        const { folders, memos } = await getAllFoldersAndMemos();
        res.render('writer', { folders, memos }); // フォルダとメモのデータを渡す
      } catch (e) {
        if (e instanceof Error) {
          // eがErrorインスタンスである場合、そのmessageプロパティを使用
          res.status(500).send(e.message);
        } else {
          // eがErrorインスタンスではない場合（文字列など）、toStringで変換
          res.status(500).send(String(e));
        }
      }
});

// 新規Bookの作成とそのBookの編集画面へのリダイレクト
router.post('/', async (req: Request, res: Response) => {
  try {
      const { title, content } = req.body;
      const book = new Book(title, content);
      const collection = await getDBCollection('books');

      // 新しいBookをデータベースに挿入
      const result = await collection.insertOne(book);

      if (result.acknowledged) {
          // 挿入が成功し、BookのIDを取得
          const bookId = result.insertedId;

          // そのBookの編集画面にリダイレクト
          res.redirect(`/book/${bookId}`);
      } else {
          // 挿入に失敗した場合
          res.status(500).send('Bookの作成に失敗しました。');
      }
  } catch (e) {
      if (e instanceof Error) {
          res.status(500).send(e.message);
      } else {
          res.status(500).send(String(e));
      }
  }
});

export default router;
