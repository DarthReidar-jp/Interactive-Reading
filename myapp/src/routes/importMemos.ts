import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { Memo } from '../models/memo';
import { getMemoVector } from '../utils/openaiUtils';
import { getDBCollection } from '../utils/dbUtils';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('jsonFile'), async (req: Request, res: Response) => {
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

        // バッチ処理を再帰的に呼び出す関数
        async function processMemos(memos: Memo[]) {
            if (memos.length === 0) {
                // req.fileが存在するかチェック
                if (req.file && req.file.path) {
                    fs.unlinkSync(req.file.path); // 処理が完了したらファイルを削除
                }
                res.redirect('/display');
                return;
            }

            // 先頭から3つのメモを取得して処理
            const batch = memos.slice(0, 3);
            await processBatch(batch);

            // 残りのメモに対して1分後に再帰的に処理
            setTimeout(() => processMemos(memos.slice(3)), 60000);
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
