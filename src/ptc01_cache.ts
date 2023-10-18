export class Cache {
  private data: any = null;

  getData(): any {
    return this.data;
  }

  setData(data: any): void {
    this.data = data;
  }
}

export const cache = new Cache();
