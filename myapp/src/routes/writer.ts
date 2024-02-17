import express, { Request, Response } from 'express';
import { Book } from '../models/book';
import { ObjectId } from 'mongodb'; // MongoDBドライバーからObjectIdをインポート
import { getAllFoldersAndMemos } from '../utils/dataFetchUtils';
import { getDBCollection } from '../utils/dbUtils';
import marked from 'marked';

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
          // Bookが見つかった場合、編集画面をレンダリング
          // 編集画面のテンプレートとして'editBook.pug'を仮定
          res.render('writer', { book });
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

// タイトル入力時にBookを作成するエンドポイント
router.post('/', async (req: Request, res: Response) => {
  try {
      const { title } = req.body; // contentの取得は削除し、titleのみ利用
      // コンテンツは後でユーザーが入力できるように、初期値として空文字列を設定
      const book = new Book(title);
      const collection = await getDBCollection('books');

      // Bookをデータベースに保存
      const result = await collection.insertOne({ title: book.title });

      if (result.acknowledged) {
          // 保存に成功したら、生成されたBookのIDを用いてリダイレクト
          res.redirect(`/writer/${result.insertedId}`);
      } else {
          res.status(500).send('Bookの作成に失敗しました。');
      }
  } catch (e) {
      // エラーハンドリングは変更なし
      if (e instanceof Error) {
          res.status(500).send(e.message);
      } else {
          res.status(500).send(String(e));
      }
  }
});

// 本の編集
router.post('/edit/:bookid', async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
      const collection = await getDBCollection('books');
      console.log(req.params);
      await collection.updateOne(
          { _id: new ObjectId(req.params.bookid) },
          { $set: { title, content } }
      );
      res.redirect(`/writer/${req.params.bookid}`);
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
