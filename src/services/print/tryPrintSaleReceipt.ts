import {Platform} from 'react-native';
import {getPrinterSdkConnection, printPrinterSdkReceiptLines} from '@/native/printerSdk';
import {reconnectStoredSdkPrinter} from './sdkPrinterStorage';

/** Prints after sale success — date/time row is dynamic at print moment (see builder). Skips silently if offline / not Android / printer not reachable. */
export async function tryPrintSaleReceipt(lines: string[]): Promise<void> {
  if (Platform.OS !== 'android' || lines.length === 0) {
    return;
  }
  try {
    let c = await getPrinterSdkConnection();
    if (!c.connected) {
      await reconnectStoredSdkPrinter();
      c = await getPrinterSdkConnection();
    }
    if (!c.connected) {
      return;
    }
    await printPrinterSdkReceiptLines(lines);
  } catch (e) {
    console.warn('[tryPrintSaleReceipt]', e);
  }
}
