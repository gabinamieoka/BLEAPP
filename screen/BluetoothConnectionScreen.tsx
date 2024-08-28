import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from "react-native";
import DeviceModal from "../components/DeviceConnectionModal";
import { PulseIndicator } from "../PulseIndicator";
import useBLE from "../components/useBLE";
import { LineChart } from "react-native-chart-kit";
const BluetoothConnectionScreen = ({ navigation }: { navigation: any }) => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
    heartRateHistory,
  } = useBLE();
  
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  console.log("vamos novamente", heartRateHistory);
  const [ImgType, setImgType] = useState("Paciente");

  // Função para renderizar a imagem com base no tipo de usuário
  const renderImage = () => {
    if (!connectedDevice) {  // Verifica se connectedDevice é true
      return (
        <Image
          style={styles.sloganImage}
          source={require('../img/iconDevice.png')}
        />
      );
    }
    // Se connectedDevice não for true, não retorna nada
    return null;
  };
  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };
 // Sanitize the data
 const sanitizedData = heartRateHistory.map(str => parseInt(str));

 // Log para verificar os dados recebidos
 console.log("Heart Rate History:", sanitizedData);
  return (
    <SafeAreaView style={styles.container}>
       {/* Renderizar a imagem com base na seleção do tipo de usuário */}
       <View style={styles.sloganWrapper}>
          {/* Imagem do Slogan */}
          
            {renderImage()}
          
        </View>
        <View style={styles.heartRateTitleWrapper}></View>
      
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
          
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Your EpyBand Is:</Text>
            <Text style={styles.heartRateText}>{heartRate} Hz</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a EpyBand Device
          </Text>
        )}
       
         {sanitizedData.length > 0 ? (
          <LineChart
            data={{
              labels: sanitizedData.map((_, index) => index.toString()),
              datasets: [
                {
                  data: sanitizedData,
                },
              ],
            }}
            width={Dimensions.get("window").width - 40} // Largura do gráfico
            height={220} // Altura do gráfico
            yAxisLabel=""
            yAxisSuffix="Hz"
            chartConfig={{
              backgroundColor: "#c2e9ff",
              backgroundGradientFrom: "#38b4fc",
              backgroundGradientTo: "#57adfd",
              decimalPlaces: 0, // Casas decimais no eixo Y
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "1",
                strokeWidth: "1",
                stroke: "#ffffff",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text style={styles.heartRateText}>No EpyBand data available</Text>
          
        )}
        <View style={{ marginBottom: 300 }} />
        </View>
     
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("DataScreen")}
        style={[styles.ctaButton, { marginTop: 8 }]}
      >
        <Text style={styles.ctaButtonText}>Go to My Data</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  sloganWrapper: {
    alignItems: "center",
    marginBottom: -150,
  },
  sloganImage: {
    marginTop: 250,
    width: 200,  // Ajuste a largura da imagem conforme necessário
    height: 100,  // Ajuste a altura da imagem conforme necessário
    resizeMode: "contain",  // Para garantir que a imagem se ajuste bem ao espaço
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    fontWeight: "bold",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 22,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: 'center',
    
    marginHorizontal: 20,
    color: "#78abbb",
  },
  heartRateText: {
    fontSize: 15,
    marginTop: 15,
  },
  picker: {
    height: 50,
    width: "100%",
    marginVertical: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: "#0cc0df",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default BluetoothConnectionScreen;