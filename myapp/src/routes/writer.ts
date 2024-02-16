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

// 新規Bookの作成
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        // Memoの型が正確には不明ですが、ここでは適切な型を持つと仮定します。
        const book = new Book(title, content);
        const collection = await getDBCollection('books');
        await collection.insertOne(book);
        res.redirect('/writer'); // 作成後は表示画面にリダイレクト
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

export default router;
