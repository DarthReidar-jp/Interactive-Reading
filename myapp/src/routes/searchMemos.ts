import express, { Request, Response } from 'express';
import { performVectorSearch } from '../utils/searchUtils';

const router = express.Router();

// ベクトル検索結果
router.get('/', async (req: Request, res: Response) => {
    const query: string = req.query.query as string; // queryパラメータを文字列として扱う

    try {
        const result = await performVectorSearch(query);
        res.render('display', { memos: result }); // 結果を表示画面に再利用
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
