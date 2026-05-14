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

export type PrinterLanguage = 'TSPL' | 'ZPL';

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
};

const Native: PrinterSdkNative | undefined = (NativeModules as any)?.PrinterSdk;

function requireNative(): PrinterSdkNative {
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
