import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View , Image, Dimensions} from "react-native";
import DeviceModal from "../components/DeviceConnectionModal";
import { PulseIndicator } from "../PulseIndicator";
import useBLE from "../components/useBLE";

// Screens/DataScreen.tsx

import { LineChart } from "react-native-chart-kit";

const MyDataScreen = ({ route }: { route: any }) => {
  const { heartRateHistory, } = useBLE();

  // Sanitizar os dados recebidos
  const sanitizedData = heartRateHistory.map((str: string) => parseInt(str));

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  heartRateText: {
    fontSize: 15,
    marginTop: 15,
  },
});

export default MyDataScreen;