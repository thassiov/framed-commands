export interface IHistoryEntry {
  date: Date;
  data: string;
  type: HistoryEntryType;
}

export enum HistoryEntryType {
  IN = 'in',
  OUT = 'out',
  ERR = 'err',
}
