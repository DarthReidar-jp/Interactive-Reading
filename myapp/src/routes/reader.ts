import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb'; // MongoDBドライバーからObjectIdをインポート
import { getDBCollection } from '../utils/dbUtils'; // getDBCollectionの実装がどこにあるかに基づいて適宜パスを修正してください

const router = express.Router();

// 特定のBookの編集画面を表示
router.get('/:bookId', async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        // パラメータから取得したbookIdを使用してMongoDBのObjectIdを生成
        const objectId = new ObjectId(bookId);
        const collection = await getDBCollection('books');

        // 指定されたIDを持つBookをデータベースから検索
        const book = await collection.findOne({ _id: objectId });

        if (book) {
            // Bookが見つかった場合、readerをレンダリング
            res.render('reader', { book });
        } else {
            // Bookが見つからない場合、404エラーを表示
            res.status(404).send('Book not found');
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
