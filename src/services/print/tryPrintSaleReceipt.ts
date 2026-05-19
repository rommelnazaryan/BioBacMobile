import {InteractionManager, Platform} from 'react-native';
import {getPrinterSdkConnection, printPrinterSdkReceiptLines} from '@/native/printerSdk';
import {
  getPersistedPrintLanguage,
  reconnectStoredSdkPrinter,
} from './sdkPrinterStorage';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function ensurePrinterReadyForPrint(): Promise<boolean> {
  let c = await getPrinterSdkConnection();
  if (c.connected) {
    return true;
  }
  await reconnectStoredSdkPrinter();
  await sleep(280);
  c = await getPrinterSdkConnection();
  if (c.connected) {
    return true;
  }
  await sleep(200);
  c = await getPrinterSdkConnection();
  return c.connected;
}

/** Prints after sale success — date/time row is dynamic at print moment (see builder). Skips silently if offline / not Android / printer not reachable. */
export async function tryPrintSaleReceipt(lines: string[]): Promise<void> {
  if (Platform.OS !== 'android' || lines.length === 0) {
    return;
  }

  await new Promise<void>(resolve => {
    InteractionManager.runAfterInteractions(() => resolve());
  });

  const lang = await getPersistedPrintLanguage();
  const maxAttempts = 4;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const ok = await ensurePrinterReadyForPrint();
      if (!ok) {
        await sleep(180 * (attempt + 1));
        continue;
      }
      await printPrinterSdkReceiptLines(lines, lang);
      return;
    } catch (e) {
      console.warn('[tryPrintSaleReceipt]', attempt + 1, e);
      await sleep(220 * (attempt + 1));
    }
  }
}
