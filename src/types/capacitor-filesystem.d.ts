declare module '@capacitor/filesystem' {
  export enum Directory {
    Documents = 'DOCUMENTS',
  }

  export interface PermissionStatus {
    publicStorage: PermissionState;
  }

  export interface ReaddirResult {
    files: Array<{
      name: string;
      size?: number;
    }>;
  }

  export interface StatResult {
    size: number;
  }

  export interface ReadFileResult {
    data: string;
  }

  export interface GetUriResult {
    uri: string;
  }

  export const Filesystem: {
    checkPermissions(): Promise<PermissionStatus>;
    requestPermissions(): Promise<PermissionStatus>;
    mkdir(options: { path: string; directory: Directory; recursive?: boolean }): Promise<void>;
    readdir(options: { path: string; directory: Directory }): Promise<ReaddirResult>;
    getUri(options: { path: string; directory: Directory }): Promise<GetUriResult>;
    readFile(options: { path: string; directory: Directory; offset?: number; length?: number }): Promise<ReadFileResult>;
    stat(options: { path: string; directory: Directory }): Promise<StatResult>;
  };
}
