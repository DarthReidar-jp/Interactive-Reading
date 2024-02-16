import express, { Request, Response } from 'express';
import { performVectorSearchTree } from '../utils/treeSearchUtils';

interface TreeNode {
  node: {
    title: string;
  };
  children?: TreeNode[];
}

function printTree(node: TreeNode | null, depth: number = 0): void {
    // ノードがnullでないことを確認
    if (!node) return;
  
    // 現在のノードの情報をインデントを用いて出力
    console.log(`${' '.repeat(depth * 2)}ノード: ${node.node.title}`);
  
    // 子ノードがある場合、それぞれの子ノードに対して再帰的にこの関数を呼び出す
    if (node.children && node.children.length > 0) {
      console.log(`${' '.repeat(depth * 2)} 子ノード:`);
      node.children.forEach(child => printTree(child, depth + 1));
    }
}

const router = express.Router();

// ベクトル検索結果
router.get('/', async (req: Request, res: Response) => {
    const query: string = req.query.query as string;

    try {
        const result: TreeNode = await performVectorSearchTree(query);
        // ツリー構造をコンソールに出力
        printTree(result);
        res.render('treeSearchDisplay', { memos: result }); // 結果を表示画面に再利用
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
