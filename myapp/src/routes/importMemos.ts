import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { Memo } from '../models/memo';
import { getMemoVector } from '../utils/openaiUtils';
import { getDBCollection } from '../utils/dbUtils';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('jsonFile'), async (req: Request, res: Response) => {
    // socket.ioで進行状況をクライアントに送信するための準備
    const io = req.app.get('io'); // app.tsで設定したsocket.ioインスタンスを取得

    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const collection = await getDBCollection('memos');
        const fileData = fs.readFileSync(req.file.path, { encoding: 'utf-8' });
        const memos: Memo[] = JSON.parse(fileData);

        if (!Array.isArray(memos)) {
            throw new Error('Uploaded file must be an array of memos');
        }

        const validMemos = memos.filter(memo => memo.title && memo.content);

        // バッチ処理関数の定義
        async function processBatch(batch: Memo[]) {
            for (const memo of batch) {
                const vector = await getMemoVector(memo.content);
                await collection.insertOne({
                    title: memo.title,
                    content: memo.content,
                    vector: vector
                });
            }
        }

        // バッチ処理を再帰的に呼び出す関数の中で進行状況を送信
        async function processMemos(memos: Memo[], startIndex: number = 0) {
            if (startIndex >= memos.length) {
                if (req.file && req.file.path) {
                    fs.unlinkSync(req.file.path); // 処理が完了したらファイルを削除
                }
                res.redirect('/display');
                return;
            }

            const batch = memos.slice(startIndex, startIndex + 3);
            await processBatch(batch);
            io.emit("progress", { progress: Math.min(100, (startIndex + batch.length) / memos.length * 100) });

            setTimeout(() => processMemos(memos, startIndex + 3), 60000);
        }

        // メモのバッチ処理を開始
        await processMemos(validMemos);

    } catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send(String(e));
        }
    }
});

export default router;
