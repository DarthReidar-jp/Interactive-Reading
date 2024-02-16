// folder.ts
export class Folder {
    public name: string;
    public description: string;
    public memoIds: string[];

    constructor(name: string, description: string = '', memoIds: string[]) {
        this.name = name;
        this.description = description;
        this.memoIds = memoIds;
    }
}
