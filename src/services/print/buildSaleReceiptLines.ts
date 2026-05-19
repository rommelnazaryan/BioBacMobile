import moment from 'moment';

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
  /** Profile / seller phone для строки «Ответственный: …». */
  responsiblePhone?: string;
  /** Если известно с бэка — строка начального долга покупателя. */
  openingBalanceDebt?: number | null;
  /** Если известно — конечный баланс после сделки (две строки: заголовок + дата сумма). */
  closingBalanceDebt?: number | null;
  /** Ширина «полотна» пробелами под центровку заголовков (совпадает с длиной разделителя). */
  contentWidth?: number;
};

const DIVIDER_LEN = 72;
const DIVIDER = '-'.repeat(DIVIDER_LEN);

const COL_NAME = 22;
const COL_QTY = 8;
const COL_UNIT = 12;
const COL_SUM = 14;

/** Character width safe for raster + ZPL rows (~58mm); keeps ИТОГО amount visible when padded then drawn RIGHT in native. */
const TOTAL_ROW_CHAR_WIDTH = 48;

function trimEndZerosOneDecimal(n: number): string {
  const s = (Math.round(n * 10) / 10).toFixed(1);
  return s;
}

function padR(s: string, w: number): string {
  const t = s.length <= w ? s : `${s.slice(0, Math.max(0, w - 3))}...`;
  return t.padEnd(w, ' ');
}

function padL(s: string, w: number): string {
  const t = s.length <= w ? s : `${s.slice(0, Math.max(0, w - 3))}...`;
  return t.padStart(w, ' ');
}

function centeredLine(text: string, width: number): string {
  if (text.length >= width) {
    return text.slice(0, width);
  }
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(pad) + text;
}

function fmtMoney2(n: number): string {
  const sign = n < 0 ? '-' : '';
  const v = Math.abs(n).toFixed(2);
  return `${sign}${v}`;
}

function saleDateDots(saleDdMmYy: string): string {
  const d = moment(saleDdMmYy, ['DD/MM/YYYY', 'D/M/YYYY'], true);
  return d.isValid() ? d.format('DD.MM.YYYY') : moment().format('DD.MM.YYYY');
}

function padLineRight(text: string, width: number): string {
  const s = text.trimEnd();
  if (s.length >= width) {
    return s.slice(-width);
  }
  return s.padStart(width, ' ');
}

function fmtDebtSuffix(amount: number): string {
  return amount < 0 ? ' долг' : '';
}

export function buildSaleReceiptLines(params: BuildSaleReceiptParams): string[] {
  const {
    buyerCompanyName,
    saleDateDdMmYy,
    items,
    totalAmount,
    receivedAmount,
    responsibleFirstName,
    responsiblePhone,
    openingBalanceDebt,
    closingBalanceDebt,
    contentWidth = DIVIDER_LEN,
  } = params;

  const lines: string[] = [];
  const nowStr = moment().format('DD.MM.YYYY HH:mm');
  lines.push(centeredLine(nowStr, contentWidth));

  lines.push('', 'ПОСТАВЩИК ООО "БИОБАК"', 'www.biobac.ru  Тел. +7-495-743-97-78');

  const fn = responsibleFirstName?.trim() ?? '';
  const ph = responsiblePhone?.trim() ?? '';
  lines.push(`Ответственный: ${fn || '-'} - ${ph || '-'}`);

  lines.push(DIVIDER);
  lines.push(centeredLine('ПОКУПАТЕЛЬ', contentWidth));

  lines.push('', buyerCompanyName?.trim() || '—');

  if (openingBalanceDebt != null && Number.isFinite(openingBalanceDebt)) {
    lines.push(
      `Начальный баланс:      ${fmtMoney2(openingBalanceDebt)}${fmtDebtSuffix(openingBalanceDebt)}`,
    );
  }

  lines.push('', DIVIDER, 'Продукт             Кол      Цена                   Сумма', '');

  for (const it of items) {
    const row =
      `${padR(it.productName, COL_NAME)}` +
      ` ${padL(String(it.quantity), COL_QTY)}` +
      ` ${padL(trimEndZerosOneDecimal(it.unitPrice), COL_UNIT)}` +
      ` ${padL(trimEndZerosOneDecimal(it.totalPrice), COL_SUM)}`;
    lines.push(row);
  }

  lines.push('');
  lines.push(
    padLineRight(
      `ИТОГО: ${trimEndZerosOneDecimal(totalAmount)}`,
      TOTAL_ROW_CHAR_WIDTH,
    ),
  );
  lines.push('');
  lines.push(`Оплачено / Paid:        ${fmtMoney2(receivedAmount)}`);

  lines.push('', 'Конечный баланс:');

  const saleDots = saleDateDots(saleDateDdMmYy);
  if (closingBalanceDebt != null && Number.isFinite(closingBalanceDebt)) {
    lines.push(
      `${saleDots}          ${fmtMoney2(closingBalanceDebt)}${fmtDebtSuffix(closingBalanceDebt)}`,
    );
  } else {
    lines.push(`${saleDots}          —`);
  }

  lines.push(
    '',
    'Подписи',
    'Подпись _____________________',
    'Ф.И.О _______________________',
    '                          М.П.',
    '',
  );

  return lines;
}
