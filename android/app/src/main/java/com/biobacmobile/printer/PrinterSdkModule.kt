package com.biobacmobile.printer

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import net.posprinter.IConnectListener
import net.posprinter.IDeviceConnection
import net.posprinter.POSConnect
import net.posprinter.TSPLConst
import net.posprinter.TSPLPrinter
import net.posprinter.ZPLConst
import net.posprinter.ZPLPrinter

class PrinterSdkModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private var connection: IDeviceConnection? = null
  private var selectedName: String? = null
  private var selectedAddress: String? = null
  private var selectedType: String? = null

  override fun getName(): String = "PrinterSdk"

  private fun bluetoothAdapter(): BluetoothAdapter? {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
      val manager = reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
      manager.adapter
    } else {
      @Suppress("DEPRECATION")
      BluetoothAdapter.getDefaultAdapter()
    }
  }

  private fun hasBluetoothPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
      return true
    }
    return reactContext.checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT) ==
      android.content.pm.PackageManager.PERMISSION_GRANTED
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  fun isBluetoothEnabled(promise: Promise) {
    if (!hasBluetoothPermission()) {
      promise.resolve(false)
      return
    }
    promise.resolve(bluetoothAdapter()?.isEnabled == true)
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  fun getBondedBluetoothDevices(promise: Promise) {
    if (!hasBluetoothPermission()) {
      promise.reject("BLUETOOTH_PERMISSION", "Bluetooth permission is not granted")
      return
    }
    val adapter = bluetoothAdapter()
    if (adapter == null) {
      promise.reject("NO_BLUETOOTH", "No bluetooth adapter available")
      return
    }
    if (!adapter.isEnabled) {
      promise.reject("BLUETOOTH_OFF", "Bluetooth is not enabled")
      return
    }

    val devices = Arguments.createArray()
    adapter.bondedDevices.forEach { device ->
      val map = Arguments.createMap()
      map.putString("name", device.name ?: "Unknown")
      map.putString("address", device.address)
      map.putBoolean("isXp", (device.name ?: "").contains("XP", ignoreCase = true))
      devices.pushMap(map)
    }
    promise.resolve(devices)
  }

  @ReactMethod
  fun getUsbDevices(promise: Promise) {
    try {
      val devices = Arguments.createArray()
      POSConnect.getUsbDevices(reactContext).forEach { device ->
        devices.pushString(device)
      }
      promise.resolve(devices)
    } catch (error: Exception) {
      promise.reject("USB_DEVICES_FAILED", error.message, error)
    }
  }

  @ReactMethod
  fun connectBluetooth(macAddress: String, name: String?, promise: Promise) {
    connect(POSConnect.DEVICE_TYPE_BLUETOOTH, macAddress, "BLE", name, promise)
  }

  @ReactMethod
  fun connectNet(ipAddress: String, promise: Promise) {
    connect(POSConnect.DEVICE_TYPE_ETHERNET, ipAddress, "NET", ipAddress, promise)
  }

  @ReactMethod
  fun connectUsb(pathName: String, promise: Promise) {
    connect(POSConnect.DEVICE_TYPE_USB, pathName, "USB", pathName, promise)
  }

  private fun connect(
    deviceType: Int,
    connectInfo: String,
    type: String,
    name: String?,
    promise: Promise,
  ) {
    try {
      connection?.close()
      val nextConnection = POSConnect.createDevice(deviceType)
      connection = nextConnection
      selectedType = type
      selectedAddress = connectInfo
      selectedName = name ?: connectInfo
      nextConnection.connect(connectInfo, IConnectListener { code, _, message ->
        when (code) {
          POSConnect.CONNECT_SUCCESS -> {
            val result = Arguments.createMap()
            result.putBoolean("connected", true)
            result.putString("type", selectedType)
            result.putString("name", selectedName)
            result.putString("address", selectedAddress)
            promise.resolve(result)
          }
          POSConnect.CONNECT_FAIL -> {
            promise.reject("CONNECT_FAIL", message.ifBlank { "Printer connection failed" })
          }
          POSConnect.CONNECT_INTERRUPT -> {
            promise.reject("CONNECT_INTERRUPT", message.ifBlank { "Printer connection interrupted" })
          }
          else -> {
            promise.reject("CONNECT_ERROR", message.ifBlank { "Printer connection error: $code" })
          }
        }
      })
    } catch (error: Exception) {
      promise.reject("CONNECT_EXCEPTION", error.message, error)
    }
  }

  @ReactMethod
  fun disconnect(promise: Promise) {
    try {
      connection?.close()
      connection = null
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("DISCONNECT_FAILED", error.message, error)
    }
  }

  @ReactMethod
  fun isConnected(promise: Promise) {
    val result = Arguments.createMap()
    result.putBoolean("connected", connection?.isConnect == true)
    result.putString("type", selectedType)
    result.putString("name", selectedName)
    result.putString("address", selectedAddress)
    promise.resolve(result)
  }

  @ReactMethod
  fun printSample(language: String, promise: Promise) {
    val conn = connection
    if (conn?.isConnect != true) {
      promise.reject("NOT_CONNECTED", "Printer is not connected")
      return
    }

    try {
      if (language.equals("ZPL", ignoreCase = true)) {
        printZplSample(conn)
      } else {
        printTsplSample(conn)
      }
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("PRINT_SAMPLE_FAILED", error.message, error)
    }
  }

  @ReactMethod
  fun printBill(language: String, promise: Promise) {
    val conn = connection
    if (conn?.isConnect != true) {
      promise.reject("NOT_CONNECTED", "Printer is not connected")
      return
    }

    try {
      if (language.equals("ZPL", ignoreCase = true)) {
        printZplBill(conn)
      } else {
        printTsplBill(conn)
      }
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("PRINT_BILL_FAILED", error.message, error)
    }
  }

  private fun printTsplSample(conn: IDeviceConnection) {
    TSPLPrinter(conn)
      .sizeMm(60.0, 30.0)
      .gapMm(2.0, 0.0)
      .speed(5.0)
      .density(10)
      .direction(TSPLConst.DIRECTION_FORWARD)
      .reference(0, 0)
      .cls()
      .text(30, 25, TSPLConst.FNT_16_24, TSPLConst.ROTATION_0, 1, 1, "BIOBAC MOBILE")
      .text(30, 65, TSPLConst.FNT_12_20, TSPLConst.ROTATION_0, 1, 1, "TSPL2 sample")
      .qrcode(360, 25, TSPLConst.EC_LEVEL_H, 4, TSPLConst.QRCODE_MODE_MANUAL, TSPLConst.ROTATION_0, "BIOBAC")
      .print(1)
  }

  private fun printTsplBill(conn: IDeviceConnection) {
    TSPLPrinter(conn)
      .sizeMm(60.0, 40.0)
      .gapMm(2.0, 0.0)
      .speed(5.0)
      .density(10)
      .direction(TSPLConst.DIRECTION_FORWARD)
      .reference(0, 0)
      .cls()
      .text(25, 20, TSPLConst.FNT_16_24, TSPLConst.ROTATION_0, 1, 1, "BIOBAC BILL")
      .bar(20, 55, 430, 2)
      .text(25, 75, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "Item")
      .text(285, 75, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "Qty")
      .text(350, 75, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "Price")
      .text(25, 105, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "Skirt Palas")
      .text(290, 105, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "x2")
      .text(350, 105, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "500$")
      .text(25, 135, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "BLOUSE ROPOL")
      .text(290, 135, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "x1")
      .text(350, 135, TSPLConst.FNT_8_12, TSPLConst.ROTATION_0, 1, 1, "300$")
      .qrcode(330, 175, TSPLConst.EC_LEVEL_H, 4, TSPLConst.QRCODE_MODE_MANUAL, TSPLConst.ROTATION_0, "BIOBAC BILL")
      .text(25, 230, TSPLConst.FNT_12_20, TSPLConst.ROTATION_0, 1, 1, "Thank you")
      .print(1)
  }

  private fun printZplSample(conn: IDeviceConnection) {
    ZPLPrinter(conn)
      .addStart()
      .setPrinterWidth(480)
      .setLabelLength(240)
      .addText(30, 25, ZPLConst.FNT_D, ZPLConst.ROTATION_0, 24, 14, "BIOBAC MOBILE")
      .addText(30, 75, ZPLConst.FNT_D, ZPLConst.ROTATION_0, 18, 10, "ZPL2 sample")
      .addQRCode(330, 25, "BIOBAC")
      .addPrintCount(1)
      .addEnd()
  }

  private fun printZplBill(conn: IDeviceConnection) {
    ZPLPrinter(conn)
      .addStart()
      .setPrinterWidth(480)
      .setLabelLength(320)
      .addText(25, 20, ZPLConst.FNT_D, ZPLConst.ROTATION_0, 24, 14, "BIOBAC BILL")
      .addBox(20, 55, 430, 2, 2)
      .addText(25, 75, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "Item")
      .addText(285, 75, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "Qty")
      .addText(350, 75, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "Price")
      .addText(25, 105, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "Skirt Palas")
      .addText(290, 105, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "x2")
      .addText(350, 105, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "500$")
      .addText(25, 135, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "BLOUSE ROPOL")
      .addText(290, 135, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "x1")
      .addText(350, 135, ZPLConst.FNT_A, ZPLConst.ROTATION_0, 16, 10, "300$")
      .addQRCode(330, 175, "BIOBAC BILL")
      .addText(25, 250, ZPLConst.FNT_D, ZPLConst.ROTATION_0, 18, 10, "Thank you")
      .addPrintCount(1)
      .addEnd()
  }
}
