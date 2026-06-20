import { Filesystem, Directory } from '@capacitor/filesystem';

const VAULT_DIR = 'local-vault';
const VAULT_DIRECTORY = Directory.Documents;

export interface MobileAsset {
  name: string;
  size: number;
  uri: string;
}

function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp4': return 'video/mp4';
    case 'webm': return 'video/webm';
    case 'ogg': return 'video/ogg';
    case 'mov': return 'video/quicktime';
    case 'mkv': return 'video/x-matroska';
    default: return 'video/mp4';
  }
}

export async function checkMobilePermissions(): Promise<'granted' | 'prompt' | 'denied'> {
  try {
    const perm = await Filesystem.checkPermissions();
    return perm.publicStorage === 'granted' ? 'granted' : (perm.publicStorage === 'denied' ? 'denied' : 'prompt');
  } catch {
    return 'prompt';
  }
}

export async function requestMobilePermissions(): Promise<'granted' | 'prompt' | 'denied'> {
  try {
    const perm = await Filesystem.requestPermissions();
    return perm.publicStorage === 'granted' ? 'granted' : (perm.publicStorage === 'denied' ? 'denied' : 'prompt');
  } catch {
    return 'prompt';
  }
}

export async function listMobileAssets(): Promise<MobileAsset[]> {
  try {
    try {
      await Filesystem.mkdir({ path: VAULT_DIR, directory: VAULT_DIRECTORY, recursive: true });
    } catch {
      // directory might already exist
    }
    const result = await Filesystem.readdir({ path: VAULT_DIR, directory: VAULT_DIRECTORY });
    const assets: MobileAsset[] = [];
    for (const file of result.files) {
      if (/\.(mp4|mov|webm|mkv)$/i.test(file.name)) {
        const uriResult = await Filesystem.getUri({ path: `${VAULT_DIR}/${file.name}`, directory: VAULT_DIRECTORY });
        assets.push({
          name: file.name,
          size: file.size || 0,
          uri: uriResult.uri,
        });
      }
    }
    return assets;
  } catch (e) {
    console.error('Failed to list mobile assets', e);
    return [];
  }
}

export async function getMobileFile(name: string): Promise<File> {
  const path = `${VAULT_DIR}/${name}`;
  const fileData = await Filesystem.readFile({
    path,
    directory: VAULT_DIRECTORY,
  });
  const base64Data = typeof fileData.data === 'string' ? fileData.data : '';
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const mimeType = getMimeType(name);
  return new File([bytes], name, { type: mimeType });
}

