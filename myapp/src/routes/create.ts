import express, { Request, Response } from 'express';
import { Memo } from '../models/memo'; // Memoモデルのインポート方法は、実際のモデルの定義によって異なる場合があります。
import { connectDB } from '../db';
import { getDBCollection } from '../utils/dbUtils';
import { getMemoVector } from '../utils/openaiUtils';

const router = express.Router();

// 新規作成画面
router.get('/', (req: Request, res: Response) => {
    res.render('create'); // 新規作成フォームのテンプレートを表示
});

// 新規メモの作成
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const vector = await getMemoVector(content);
        // Memoの型が正確には不明ですが、ここでは適切な型を持つと仮定します。
        const memo = new Memo(title, content, vector);
        const collection = await getDBCollection('memos');
        await collection.insertOne(memo);
        res.redirect('/display'); // 作成後は表示画面にリダイレクト
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

export default router;
