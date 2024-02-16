// memo.ts
export class Memo {
  public title: string;
  public content: string;
  public vector: string;
  public folderIds: string[];
  public score: number;

  constructor(title: string, content: string, vector: string, folderIds: string[] = [],score: number) {
      this.title = title;
      this.content = content;
      this.vector = vector;
      this.folderIds = folderIds;
      this.score = score;
  }
}