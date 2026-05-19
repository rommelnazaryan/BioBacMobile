import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import {
  NetPrinter,
  NetPrinterEventEmitter,
  RN_THERMAL_RECEIPT_PRINTER_EVENTS,
} from 'react-native-thermal-receipt-printer-image-qr';
import {
  checkMultiple,
  openSettings,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {Colors} from '@/theme/Colors';
import {Feather, MaterialIcons} from '@/component/icons/VectorIcon';
import {
  connectPrinterBluetooth,
  connectPrinterNet,
  connectPrinterUsb,
  disconnectPrinterSdk,
  getBondedPrinterBluetoothDevices,
  getPrinterUsbDevices,
  isPrinterBluetoothEnabled,
  type PrinterLanguage,
  printPrinterSdkBill,
  printPrinterSdkSample,
} from '@/native/printerSdk';
import {
  persistLastSdkPrinterCredential,
  persistPrintLanguage,
} from '@/services/print/sdkPrinterStorage';
import Header from '@/navigation/Header';
import { t } from '@/locales';
import CustomHeader from '@/navigation/Header';
type PrinterKind = 'BLE' | 'NET' | 'USB';

/** Demo QR — همان الگوی کتابخانه؛ می‌توانید URL یا بیس‌۶۴ خودتان را جایگزین کنید */
const DEMO_QR_IMAGE =
  'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' +
  encodeURIComponent('https://example.com/receipt-demo');

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function isBluetoothDisabledError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('bluetooth') &&
    (normalized.includes('disabled') ||
      normalized.includes('not enabled') ||
      normalized.includes('turned off') ||
      normalized.includes('is off'))
  );
}

function isMissingBleNativeModuleError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('cannot read property') &&
    normalized.includes('init') &&
    normalized.includes('null')
  );
}

/** مطابق تایپ‌های کتابخانه (در runtime ممکن است فیلدها number برگردند؛ قبل از connect به string نرمال می‌کنیم) */
type BleDevice = {device_name: string; inner_mac_address: string};
type UsbDevice = {device_name: string; path: string};
type NetDevice = {host: string; port: number};
type PickerRow = NetDevice | BleDevice | UsbDevice;

const KIND_OPTIONS: {key: PrinterKind; label: string}[] = [
  {key: 'BLE', label: 'Bluetooth'},
  // {key: 'NET', label: 'NET'},
  // {key: 'USB', label: 'USB'},
];

const LANGUAGE_OPTIONS: {key: PrinterLanguage; label: string}[] = [
  {key: 'TSPL', label: 'TSPL2'},
  {key: 'ZPL', label: 'ZPL2'},
  {key: 'ESC_POS', label: 'ESC/POS'},
];

export default function PrinterScreen() {
  const [kind, setKind] = useState<PrinterKind>('BLE');
  const [language, setLanguage] = useState<PrinterLanguage>('TSPL');
  const [ip, setIp] = useState('');
  const [busy, setBusy] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [netDevices, setNetDevices] = useState<NetDevice[]>([]);
  const [bleDevices, setBleDevices] = useState<BleDevice[]>([]);
  const [usbDevices, setUsbDevices] = useState<UsbDevice[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTitle, setPickerTitle] = useState('');

  const [selectedBle, setSelectedBle] = useState<BleDevice | null>(null);
  const [selectedUsb, setSelectedUsb] = useState<UsbDevice | null>(null);

  const openBluetoothSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'android' && Linking.sendIntent) {
        await Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
        return;
      }
      await openSettings();
    } catch {
      // ignore
    }
  }, []);

  const requestEnableBluetooth = useCallback(async () => {
    try {
      if (Platform.OS === 'android' && Linking.sendIntent) {
        await Linking.sendIntent(
          'android.bluetooth.adapter.action.REQUEST_ENABLE',
        );
        return;
      }
      await openBluetoothSettings();
    } catch {
      await openBluetoothSettings();
    }
  }, [openBluetoothSettings]);

  const ensureBlePermissions = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    const androidPermissions =
      Number(Platform.Version) >= 31
        ? [
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          ]
        : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

    let statuses = await checkMultiple(androidPermissions);
    const needRequest = androidPermissions.filter(
      permission => statuses[permission] !== RESULTS.GRANTED,
    );

    if (needRequest.length > 0) {
      const requested = await requestMultiple(needRequest);
      statuses = {...statuses, ...requested};
    }

    const allGranted = androidPermissions.every(
      permission => statuses[permission] === RESULTS.GRANTED,
    );
    if (allGranted) {
      return true;
    }

    Alert.alert(
      'BLE Permission',
      'Bluetooth permission is required for scanning printers.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open settings',
          onPress: () => {
            openSettings().catch(() => undefined);
          },
        },
      ],
    );
    return false;
  }, []);

  const showBluetoothOffAlert = useCallback(
    (message = 'Please turn on Bluetooth, then try again.') => {
      Alert.alert('Bluetooth is off', message, [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Turn on', onPress: requestEnableBluetooth},
        {text: 'Settings', onPress: openBluetoothSettings},
      ]);
    },
    [openBluetoothSettings, requestEnableBluetooth],
  );

  const ensureBleReady = useCallback(async () => {
    const hasPermission = await ensureBlePermissions();
    if (!hasPermission) {
      return false;
    }

    try {
      const enabled = await isPrinterBluetoothEnabled();
      if (enabled) {
        return true;
      }
      await requestEnableBluetooth();
      showBluetoothOffAlert(
        'Bluetooth is turned off. Turn it on before scanning printers.',
      );
      return false;
    } catch (error) {
      const message = toErrorMessage(error);
      if (
        isBluetoothDisabledError(message) ||
        message.toLowerCase().includes('adapter is not enabled')
      ) {
        await requestEnableBluetooth();
        showBluetoothOffAlert(
          'Bluetooth is turned off. Open Bluetooth settings and enable it before scanning printers.',
        );
        return false;
      }

      if (isMissingBleNativeModuleError(message)) {
        Alert.alert(
          'Printer SDK is not ready',
          'Rebuild and reinstall the Android app so the official printer SDK native module is loaded.',
        );
        return false;
      }

      Alert.alert('BLE', message);
      return false;
    }
  }, [
    ensureBlePermissions,
    requestEnableBluetooth,
    showBluetoothOffAlert,
  ]);

  const closeConnSafe = useCallback(async () => {
    try {
      await disconnectPrinterSdk();
    } catch {
      // ignore
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      closeConnSafe();
    };
  }, [closeConnSafe]);

  useEffect(() => {
    persistPrintLanguage(language).catch(() => undefined);
  }, [language]);

  useEffect(() => {
    const sub = NetPrinterEventEmitter.addListener(
      RN_THERMAL_RECEIPT_PRINTER_EVENTS.EVENT_NET_PRINTER_SCANNED_SUCCESS,
      (payload: NetDevice[] | null) => {
        const list = Array.isArray(payload) ? payload : [];
        setNetDevices(list);
        setBusy(false);
        if (list.length === 0) {
          Alert.alert('NET', 'No network printers found on this subnet.');
        } else {
          setPickerTitle('Select printer (NET)');
          setPickerOpen(true);
        }
      },
    );
    return () => sub.remove();
  }, []);

  const onChangeKind = async (next: PrinterKind) => {
    if (next === 'USB' && Platform.OS !== 'android') {
      Alert.alert('USB', 'USB printers are only supported on Android.');
      return;
    }
    await closeConnSafe();
    setSelectedBle(null);
    setSelectedUsb(null);
    setKind(next);
    if (next === 'BLE') {
      const hasPermission = await ensureBlePermissions();
      if (hasPermission) {
        await requestEnableBluetooth();
      }
    }
  };

  const findPrinters = async () => {
    setBusy(true);
    try {
      if (kind === 'BLE') {
        const isReady = await ensureBleReady();
        if (!isReady) {
          setBusy(false);
          return;
        }
        const raw = await getBondedPrinterBluetoothDevices();
        const list = raw.map(device => ({
          device_name: device.name,
          inner_mac_address: device.address,
        }));
        setBleDevices(list);
        setBusy(false);
        if (!list.length) {
          Alert.alert(
            'BLE',
            'No paired Bluetooth printers found. Turn on Bluetooth and pair the printer in system settings first.',
            [
              {text: 'Close', style: 'cancel'},
              {text: 'Bluetooth settings', onPress: openBluetoothSettings},
            ],
          );
          return;
        }
        setPickerTitle('Select printer (BLE)');
        setPickerOpen(true);
        return;
      }

      if (kind === 'NET') {
        setNetDevices([]);
        await NetPrinter.getDeviceList();
        return;
      }
      const raw = await getPrinterUsbDevices();
      const list: UsbDevice[] = raw.map(device => ({
        device_name: device,
        path: device,
      }));
      setUsbDevices(list);
      setBusy(false);
      if (!list.length) {
        Alert.alert('USB', 'No USB printers found.');
        return;
      }
      setPickerTitle('Select printer (USB)');
      setPickerOpen(true);
    } catch (e) {
      setBusy(false);
      const message = toErrorMessage(e);
      if (kind === 'BLE' && isBluetoothDisabledError(message)) {
        showBluetoothOffAlert(
          'Please turn on Bluetooth, then try "Find your printers" again.',
        );
        return;
      }
      Alert.alert('Find printers', message);
    }
  };

  const connectPrinter = async () => {
    setBusy(true);
    try {
      const didConnect = await connectCurrentPrinter();
      if (!didConnect) {
        return;
      }
      if (kind === 'BLE' && selectedBle?.inner_mac_address) {
        await persistLastSdkPrinterCredential({
          kind: 'BLE',
          mac: selectedBle.inner_mac_address,
          name: selectedBle.device_name,
        });
      } else if (kind === 'USB' && selectedUsb?.path) {
        await persistLastSdkPrinterCredential({
          kind: 'USB',
          path: selectedUsb.path,
        });
      } else if (kind === 'NET') {
        const host = ip.trim();
        if (host) {
          await persistLastSdkPrinterCredential({kind: 'NET', host});
        }
      }
      setConnected(true);
      Alert.alert('Printer', 'Connected');
    } catch (e) {
      setConnected(false);
      const message = toErrorMessage(e);
      if (kind === 'BLE' && isBluetoothDisabledError(message)) {
        showBluetoothOffAlert('Please turn on Bluetooth, then connect again.');
      } else {
        Alert.alert('Connect', message);
      }
    } finally {
      setBusy(false);
    }
  };

  const connectCurrentPrinter = async () => {
    if (kind === 'NET') {
      const host = ip.trim();
      if (!host) {
        throw new Error('Enter printer IP');
      }
      await connectPrinterNet(host);
      return true;
    }

    if (kind === 'BLE') {
      const isReady = await ensureBleReady();
      if (!isReady) {
        return false;
      }
      if (!selectedBle?.inner_mac_address) {
        throw new Error('Pick a BLE printer first (Find your printers).');
      }
      await connectPrinterBluetooth(
        selectedBle.inner_mac_address,
        selectedBle.device_name,
      );
      return true;
    }

    if (!selectedUsb) {
      throw new Error('Pick a USB printer first (Find your printers).');
    }
    await connectPrinterUsb(selectedUsb.path);
    return true;
  };

  const requireConnection = () => {
    if (!connected) {
      Alert.alert('Printer', 'Connect to a printer first.');
      return false;
    }
    return true;
  };

  const runPrintJob = async (job: () => Promise<unknown>) => {
    if (!requireConnection() || printing) {
      return;
    }
    setPrinting(true);
    try {
      const didConnect = await connectCurrentPrinter();
      if (!didConnect) {
        return;
      }
      await job();
    } catch (error) {
      setConnected(false);
      Alert.alert('Print', toErrorMessage(error));
    } finally {
      setTimeout(() => setPrinting(false), 1200);
    }
  };

  const printSample = () => {
    if (!requireConnection()) {
      return;
    }
    runPrintJob(() => printPrinterSdkSample(language));
  };

  const printBillColumns = () => {
    if (!requireConnection()) {
      return;
    }
    runPrintJob(() => printPrinterSdkBill(language));
  };

  const printBillWithImage = () => {
    if (!requireConnection()) {
      return;
    }
    runPrintJob(async () => {
      await printPrinterSdkBill(language);
      Alert.alert(
        'Printer SDK',
        `${language} label bill printed.`,
      );
    });
  };

  const pickerRows: PickerRow[] =
    kind === 'NET' ? netDevices : kind === 'BLE' ? bleDevices : usbDevices;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
    <CustomHeader
        title={t('common.printer')}
        showBack={true}
      />       
       <Text style={styles.label}>Select printer type:</Text>
        {KIND_OPTIONS.map(opt => {
          if (opt.key === 'USB' && Platform.OS !== 'android') {
            return null;
          }
          const selected = kind === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => onChangeKind(opt.key)}
              style={[styles.typeRow, selected && styles.typeRowSelected]}>
              <Text style={[styles.typeText, selected && styles.typeTextSel]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}

        <Text style={styles.label}>Select printer language:</Text>
        {LANGUAGE_OPTIONS.map(opt => {
          const selected = language === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setLanguage(opt.key)}
              style={[styles.typeRow, selected && styles.typeRowSelected]}>
              <Text style={[styles.typeText, selected && styles.typeTextSel]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}

        {/* {kind === 'NET' ? (
          <>
            <Text style={styles.label}>Your printer ip....</Text>
            <TextInput
              value={ip}
              onChangeText={setIp}
              placeholder="192.168.0.101"
              placeholderTextColor={Colors.gray}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              style={styles.input}
            />
          </>
        ) : null} */}

        {kind === 'BLE' && selectedBle ? (
          <Text style={styles.hint}>
            BLE: {selectedBle.device_name || 'Device'}{' '}
            <Text style={styles.mono}>({selectedBle.inner_mac_address})</Text>
          </Text>
        ) : null}
{/* 
        {kind === 'USB' && selectedUsb ? (
          <Text style={styles.hint}>
            USB: {selectedUsb.path}
          </Text>
        ) : null} */}

        <Pressable
          onPress={findPrinters}
          disabled={busy}
          style={[styles.btnGray, busy && styles.btnDisabled]}>
          <Feather name="search" size={20} color={Colors.lightBlack} />
          <Text style={styles.btnGrayText}> Find your printers</Text>
        </Pressable>

        <Pressable
          onPress={connectPrinter}
          disabled={busy}
          style={[styles.btnGreen, busy && styles.btnDisabled]}>
          <MaterialIcons name="device-hub" size={22} color={Colors.white} />
          <Text style={styles.btnPrimaryText}> Connect</Text>
        </Pressable>

        <Pressable
          onPress={printSample}
          disabled={busy || printing}
          style={[styles.btnBlue, (busy || printing) && styles.btnDisabled]}>
          <MaterialIcons name="print" size={22} color={Colors.white} />
          <Text style={styles.btnPrimaryText}>
            {printing ? ' Printing...' : ' Print sample'}
          </Text>
        </Pressable>
{/* 
        <Pressable
          onPress={printBillColumns}
          disabled={busy || printing}
          style={[styles.btnBlue, (busy || printing) && styles.btnDisabled]}>
          <MaterialIcons name="receipt-long" size={22} color={Colors.white} />
          <Text style={styles.btnPrimaryText}> Print bill</Text>
        </Pressable> */}

        {/* <Pressable
          onPress={printBillWithImage}
          disabled={busy || printing}
          style={[styles.btnBlue, (busy || printing) && styles.btnDisabled]}>
          <MaterialIcons name="qr-code-2" size={22} color={Colors.white} />
          <Text style={styles.btnPrimaryText}> Print bill With Image</Text>
        </Pressable> */}

        {/* <Text style={styles.previewLabel}>QR preview</Text>
        <Image source={{uri: DEMO_QR_IMAGE}} style={styles.qr} /> */}

        {busy ? (
          <ActivityIndicator style={styles.spinner} color={Colors.blue} />
        ) : null}
      </ScrollView>

      <Modal visible={pickerOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{pickerTitle}</Text>
            <FlatList<PickerRow>
              data={pickerRows}
              keyExtractor={(item, index) => {
                if (kind === 'NET') {
                  const n = item as NetDevice;
                  return `${n.host}:${n.port}`;
                }
                if (kind === 'BLE') {
                  return (item as BleDevice).inner_mac_address;
                }
                const u = item as UsbDevice;
                return `${u.path}:${index}`;
              }}
              renderItem={({item}) => {
                let label: string;
                if (kind === 'NET') {
                  const d = item as NetDevice;
                  label = `${d.host}:${d.port}`;
                } else if (kind === 'BLE') {
                  const d = item as BleDevice;
                  label = `${d.device_name || 'BLE'} (${d.inner_mac_address})`;
                } else {
                  const d = item as UsbDevice;
                  label = `USB ${d.device_name || d.path}`;
                }
                return (
                  <Pressable
                    style={styles.listItem}
                    onPress={() => {
                      if (kind === 'NET') {
                        setIp((item as NetDevice).host);
                      } else if (kind === 'BLE') {
                        setSelectedBle(item as BleDevice);
                      } else {
                        setSelectedUsb(item as UsbDevice);
                      }
                      setPickerOpen(false);
                    }}>
                    <Text style={styles.listItemText}>{label}</Text>
                  </Pressable>
                );
              }}
            />
            <Pressable
              onPress={() => setPickerOpen(false)}
              style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    width:'90%',
    alignSelf:'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: Colors.lightBlack,
    marginTop: 8,
    marginBottom: 6,
  },
  typeRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray_200,
  },
  typeRowSelected: {
    backgroundColor: Colors.gray_200,
  },
  typeText: {
    fontSize: 16,
    color: Colors.lightBlack,
  },
  typeTextSel: {
    fontWeight: '600',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_300,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.black,
  },
  hint: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.gray_400,
  },
  mono: {
    fontFamily: Platform.select({ios: 'Menlo', android: 'monospace'}),
  },
  btnGray: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardgray,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  btnGrayText: {
    fontSize: 16,
    color: Colors.lightBlack,
    fontWeight: '500',
  },
  btnGreen: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  btnBlue: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  btnPrimaryText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  previewLabel: {
    marginTop: 24,
    textAlign: 'center',
    color: Colors.gray_400,
    fontSize: 13,
  },
  qr: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 12,
    resizeMode: 'contain',
  },
  spinner: {
    marginTop: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    maxHeight: '70%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.black,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray_200,
  },
  listItemText: {
    fontSize: 15,
    color: Colors.lightBlack,
  },
  modalClose: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalCloseText: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
});
