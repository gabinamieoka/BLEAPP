import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginnScreen from "./screen/LoginnScreen";
import BluetoothConnectionScreen from "./screen/BluetoothConnectionScreen";
import MyDataScreen from "./screen/MyDataScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginnScreen} />
        <Stack.Screen name="BluetoothConnection" component={BluetoothConnectionScreen} />
        <Stack.Screen name="MyData" component={MyDataScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;