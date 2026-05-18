import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  connectPrinterBluetooth,
  connectPrinterNet,
  connectPrinterUsb,
} from '@/native/printerSdk';

export const LAST_SDK_PRINTER_CREDENTIALS_KEY = '@BioBac/sdk_printer_credentials_v1';

export type PersistedSdkPrinter =
  | {kind: 'BLE'; mac: string; name?: string}
  | {kind: 'USB'; path: string}
  | {kind: 'NET'; host: string};

export async function persistLastSdkPrinterCredential(
  value: PersistedSdkPrinter | null,
): Promise<void> {
  if (!value) {
    await AsyncStorage.removeItem(LAST_SDK_PRINTER_CREDENTIALS_KEY);
    return;
  }
  await AsyncStorage.setItem(
    LAST_SDK_PRINTER_CREDENTIALS_KEY,
    JSON.stringify(value),
  );
}

export async function reconnectStoredSdkPrinter(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(LAST_SDK_PRINTER_CREDENTIALS_KEY);
  if (!raw) {
    return false;
  }
  let s: PersistedSdkPrinter;
  try {
    s = JSON.parse(raw) as PersistedSdkPrinter;
  } catch {
    return false;
  }

  try {
    if (s.kind === 'BLE' && s.mac) {
      await connectPrinterBluetooth(s.mac, s.name);
      return true;
    }
    if (s.kind === 'USB' && s.path) {
      await connectPrinterUsb(s.path);
      return true;
    }
    if (s.kind === 'NET' && s.host) {
      await connectPrinterNet(s.host);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
