// routes/displayMemos.ts
import express, { Request, Response } from 'express';
import { getAllBooks } from '../utils/dataFetchUtils';

const router = express.Router();

// 表示画面（Book一覧）
router.get('/', async (req: Request, res: Response) => {
  try {
    const { books } = await getAllBooks();
    res.render('bookDisplay', { books }); // フォルダとメモのデータを渡す
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
