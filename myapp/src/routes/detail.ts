// routes/detail.ts
import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getMemoVector } from '../utils/openaiUtils';
import { getDBCollection } from '../utils/dbUtils';

const router = express.Router();

// メモの詳細を表示
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const collection = await getDBCollection('memos');
        const memo = await collection.findOne({ _id: new ObjectId(req.params.id) });
        res.render('detail', { memo });
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

// メモの編集とエンベディングの更新を処理
router.post('/edit/:id', async (req: Request, res: Response) => {
    const { title, content } = req.body;
    try {
        const collection = await getDBCollection('memos');
        const vector = await getMemoVector(content);
        await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { title, content, vector } }
        );
        res.redirect(`/detail/${req.params.id}`);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

// 削除
router.post('/delete/:id', async (req: Request, res: Response) => {
    try {
        console.log('削除リクエスト受信:', req.params.id);
        const collection = await getDBCollection('memos');
        await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.redirect('/display');
    } catch (e) {
        console.error('削除中のエラー:', e);
        res.status(500).send(e.toString());
    }
});

export default router;
