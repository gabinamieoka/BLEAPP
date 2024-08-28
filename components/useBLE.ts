/* eslint-disable no-bitwise */
import { useMemo, useState, useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const HEART_RATE_UUID = "e8209c94-f39c-44ae-84c3-bc353474f010";
const HEART_RATE_CHARACTERISTIC = "b8f28f7d-0cc5-4187-9865-b6e8c0a7d3fd";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  heartRate: string;
  heartRateHistory: string[]; // Novo estado para armazenar o histórico dos valores de heartRate
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<string>("200");
  const [heartRateHistory, setHeartRateHistory] = useState<string[]>([]); // Novo estado
  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };
  useEffect(() => {
    console.log("Histórico atualizado:", heartRateHistory);
  }, [heartRateHistory]);
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes("myESP32")) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      console.log("bem sucedido");
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setHeartRate("0");
    }
  };
  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log("Erro ao receber a notificação:", error);
      return;
    }
  
    if (characteristic?.value) {
      // Decodifique o valor da característica que é esperado como uma string codificada em base64
      const decodedValue = base64.decode(characteristic.value);
      console.log("Tipo de decodedValue:", typeof decodedValue);
      const heartRateValue = parseInt(decodedValue); 
      console.log("heartRateValue", heartRateValue)
      if (!isNaN(heartRateValue)) {
        console.log("Valor da característica recebido:", heartRateValue);
        
        // Atualize o estado com o valor recebido
        setHeartRate(decodedValue);
        setHeartRateHistory((prev) => {
          const updatedHistory = [...prev, decodedValue];
          
          return updatedHistory;
        });
        console.log("historicos", heartRateHistory);
      
      } else {
        console.log("Valor recebido não é um número válido:", decodedValue);
      }
    } else {
      console.log("Nenhum valor foi recebido.");
    }
  };
      
  const startStreamingData = async (device: Device) => {
    if (device) {
      try {
        // Inicia o monitoramento da característica, recebendo os dados através de onHeartRateUpdate
        const subscription = device.monitorCharacteristicForService(
          HEART_RATE_UUID,
          HEART_RATE_CHARACTERISTIC,
          onHeartRateUpdate
        );
  
        console.log("Monitoramento iniciado.", heartRateHistory);
        
        // Retorne a subscription para que ela possa ser cancelada posteriormente, se necessário
        return subscription;
  
      } catch (error) {
        console.log("Erro ao iniciar o monitoramento da característica:", error);
      }
    } else {
      console.log("Nenhum dispositivo conectado.");
    }
  };
  



  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
    heartRateHistory, // Retorna o histórico de valores
  };
}

export default useBLE;