import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import { getMemoVector } from '../utils/openaiUtils';
import { getDBCollection } from '../utils/dbUtils';

const router = express.Router();

// アップロードされたファイルを一時的に保存するディレクトリ
const upload = multer({ dest: 'uploads/' });

interface Memo {
  title: string;
  content: string;
  vector?: string;
}

// JSONインポート機能のルート
router.post('/', upload.single('jsonFile'), async (req: Request, res: Response) => {
    try {
        const collection = await getDBCollection('memos');
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        const fileData = fs.readFileSync(req.file.path, { encoding: 'utf-8' });
        const memos: Memo[] = JSON.parse(fileData);
  
        // データ検証を行う
        if (!Array.isArray(memos)) {
            throw new Error('Uploaded file must be an array of memos');
        }
  
        const validMemos = memos.filter(memo => memo.title && memo.content);
        if (validMemos.length !== memos.length) {
            throw new Error('Some memos are missing a title or content');
        }
  
        // データベースにメモを保存
        await Promise.all(validMemos.map(async (memo) => {
            // Memoモデルに従って新しいメモを作成
            await collection.insertOne({
                title: memo.title,
                content: memo.content,
                // ベクトルデータが必要な場合はここで生成
                vector: await getMemoVector(memo.content)
            });
        }));
  
        fs.unlinkSync(req.file.path); // アップロードされたファイルを削除
        res.redirect('/display');
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
