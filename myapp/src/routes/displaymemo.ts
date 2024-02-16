// routes/displayMemos.ts
import express, { Request, Response } from 'express';
import { getAllFoldersAndMemos } from '../utils/dataFetchUtils';

const router = express.Router();

// 表示画面（メモ一覧）
router.get('/', async (req: Request, res: Response) => {
  try {
    const { folders, memos } = await getAllFoldersAndMemos();
    res.render('display', { folders, memos }); // フォルダとメモのデータを渡す
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

export = router;
