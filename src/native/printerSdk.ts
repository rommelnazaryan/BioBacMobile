import {NativeModules, Platform} from 'react-native';

export type PrinterConnection = {
  connected: boolean;
  type?: 'BLE' | 'NET' | 'USB';
  name?: string;
  address?: string;
};

export type PrinterBluetoothDevice = {
  name: string;
  address: string;
  isXp: boolean;
};

export type PrinterLanguage = 'TSPL' | 'ZPL' | 'ESC_POS';

type PrinterSdkNative = {
  isBluetoothEnabled: () => Promise<boolean>;
  getBondedBluetoothDevices: () => Promise<PrinterBluetoothDevice[]>;
  getUsbDevices: () => Promise<string[]>;
  connectBluetooth: (
    macAddress: string,
    name?: string,
  ) => Promise<PrinterConnection>;
  connectNet: (ipAddress: string) => Promise<PrinterConnection>;
  connectUsb: (pathName: string) => Promise<PrinterConnection>;
  disconnect: () => Promise<boolean>;
  isConnected: () => Promise<PrinterConnection>;
  printSample: (language: PrinterLanguage) => Promise<boolean>;
  printBill: (language: PrinterLanguage) => Promise<boolean>;
  printReceiptLines?: (lines: string[]) => Promise<boolean>;
  /** Prefer this on Android — survives bridge quirks vs raw array arguments. */
  printReceiptLinesJson?: (linesJson: string) => Promise<boolean>;
  printEscPosReceiptLinesJson?: (linesJson: string) => Promise<boolean>;
};

function getPrinterSdkNative(): PrinterSdkNative | undefined {
  return NativeModules.PrinterSdk as PrinterSdkNative | undefined;
}

function requireNative(): PrinterSdkNative {
  const Native = getPrinterSdkNative();
  if (Platform.OS !== 'android' || !Native) {
    throw new Error('Printer SDK is only available on Android after rebuild.');
  }
  return Native;
}

export function isPrinterBluetoothEnabled() {
  return requireNative().isBluetoothEnabled();
}

export function getBondedPrinterBluetoothDevices() {
  return requireNative().getBondedBluetoothDevices();
}

export function getPrinterUsbDevices() {
  return requireNative().getUsbDevices();
}

export function connectPrinterBluetooth(macAddress: string, name?: string) {
  return requireNative().connectBluetooth(macAddress, name);
}

export function connectPrinterNet(ipAddress: string) {
  return requireNative().connectNet(ipAddress);
}

export function connectPrinterUsb(pathName: string) {
  return requireNative().connectUsb(pathName);
}

export function disconnectPrinterSdk() {
  return requireNative().disconnect();
}

export function getPrinterSdkConnection() {
  return requireNative().isConnected();
}

export function printPrinterSdkSample(language: PrinterLanguage) {
  return requireNative().printSample(language);
}

export function printPrinterSdkBill(language: PrinterLanguage) {
  return requireNative().printBill(language);
}

export function printPrinterSdkReceiptLines(
  lines: string[],
  language: PrinterLanguage = 'TSPL',
): Promise<boolean> {
  const n = requireNative();
  const jsonPayload = JSON.stringify(lines);
  if (
    language === 'ESC_POS' &&
    typeof n.printEscPosReceiptLinesJson === 'function'
  ) {
    return n.printEscPosReceiptLinesJson.call(n, jsonPayload);
  }
  if (typeof n.printReceiptLinesJson === 'function') {
    return n.printReceiptLinesJson.call(n, jsonPayload);
  }
  if (typeof n.printReceiptLines === 'function') {
    return n.printReceiptLines.call(n, lines);
  }
  return Promise.reject(
    new Error(
      'PrinterSdk has no receipt print API. Rebuild and reinstall the Android app.',
    ),
  );
}
