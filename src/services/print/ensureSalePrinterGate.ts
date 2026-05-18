import {Platform} from 'react-native';
import {
  getPrinterSdkConnection,
  isPrinterBluetoothEnabled,
} from '@/native/printerSdk';
import {reconnectStoredSdkPrinter} from './sdkPrinterStorage';

type ShowToast = (
  message: string,
  options?: {type?: 'success' | 'error' | 'info'},
) => void;

/**
 * Server create/update: require BLE on + printer SDK connected (or reconnect via last Printer screen pairing).
 */
export async function ensureSalePrinterGate(show: ShowToast): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  let bluetoothOn = false;
  try {
    bluetoothOn = await isPrinterBluetoothEnabled();
  } catch {
    bluetoothOn = false;
  }

  if (!bluetoothOn) {
    show('Bluetooth is off. Turn it on and connect your printer.', {
      type: 'error',
    });
    return false;
  }

  try {
    let c = await getPrinterSdkConnection();
    if (!c.connected) {
      await reconnectStoredSdkPrinter();
      c = await getPrinterSdkConnection();
    }
    if (!c.connected) {
      show('Printer not connected. Open Printer tab and tap Connect.', {
        type: 'error',
      });
      return false;
    }
  } catch {
    show('Printer not connected. Open Printer tab and tap Connect.', {
      type: 'error',
    });
    return false;
  }

  return true;
}
