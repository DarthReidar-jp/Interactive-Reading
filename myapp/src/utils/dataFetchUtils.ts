// dataFetchUtils.ts
import { getDBCollection } from './dbUtils';
import { Folder } from '../models/folder'; // Folderクラスのインポート
import { Memo } from '../models/memo'; // Memoクラスのインポート

export async function getAllFolders(): Promise<{ folders: Folder[] }> {
  try {
    const foldersCollection = await getDBCollection('folders');
    const folders: Folder[] = await foldersCollection.find({}).toArray();
    return { folders };
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getAllMemos(): Promise<{ memos: Memo[] }> {
  try {
    const memosCollection = await getDBCollection('memos');
    const memos: Memo[] = await memosCollection.find({}).toArray();
    return { memos };
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getAllFoldersAndMemos(): Promise<{ folders: Folder[], memos: Memo[] }> {
  try {
    const foldersCollection = await getDBCollection('folders');
    const folders: Folder[] = await foldersCollection.find({}).toArray();
    const memosCollection = await getDBCollection('memos');
    const memos: Memo[] = await memosCollection.find({}).toArray();
    return { folders, memos };
  } catch (e) {
    throw new Error(e.message);
  }
}
