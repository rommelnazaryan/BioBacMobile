import moment from 'moment';

/** Kept for typing / callers (sale hook); slip content is static header only for now. */
export type SaleReceiptItemLine = {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type BuildSaleReceiptParams = {
  dealName: string;
  buyerCompanyName?: string;
  orderDateDdMmYy: string;
  saleDateDdMmYy: string;
  contactPersonName?: string;
  items: SaleReceiptItemLine[];
  totalAmount: number;
  receivedAmount: number;
  responsibleFirstName?: string;
  lineWidth?: number;
};

/**
 * Slip: only supplier block + Ответственный (static), then print-time date/time line.
 */
export function buildSaleReceiptLines({
  responsibleFirstName,
  lineWidth = 32,
}: BuildSaleReceiptParams): string[] {
  const nowStr = moment().format('DD.MM.YYYY HH:mm');
  const dateTimeLine = nowStr.padStart(lineWidth);
  const responsibleName = responsibleFirstName?.trim() || '-';

  return [
    dateTimeLine,
    '',
    'ПОСТАВЩИК ООО "БИОБАК"',
    'www.biobac.ru',
    'Тел. +7 495-743-97-78',
    'Ответственный: ' + responsibleName,
    '+7-925-473-82-76',
    '',
  ];
}
