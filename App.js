import react, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ScrollView,
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';

const windowWidth = Dimensions.get('window').width;

export default function App() {

  const [location, setLocation] = useState();
  const [city, setCity] = useState("🌐..");
  const [district, setDistrict] = useState("");
  const [ok, setOk] = useState(true);

  const ask = async() => {
    // 접근 허가를 받았는지 검사
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setOk(false);
    }

    // 위치 정보를 가져온다
    let {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    // 위치 정보를 통해 위치명을 가져온다
    let location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    setDistrict(location[0].district);
  }

  useEffect(()=> {
    ask();
  }, [])

  return (
    <View style={styles.container}>

      <StatusBar backgroundColor="black"></StatusBar>

      <View style={styles.city}>
      
        <Text style={styles.cityName}>{city} {district}</Text>
      
      </View>

      <ScrollView pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        
        <View style={styles.day}>
      
          <Text style={styles.temperture}>27°</Text>
          <Text style={styles.description}>Sunny</Text>
      
        </View>

        
        <View style={styles.day}>
      
          <Text style={styles.temperture}>27°</Text>
          <Text style={styles.description}>Sunny</Text>
      
        </View>

        
        <View style={styles.day}>
      
          <Text style={styles.temperture}>27°</Text>
          <Text style={styles.description}>Sunny</Text>
      
        </View>
      
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DAA520",
  },

  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 40,
    fontWeight: 500,
  },

  weather: {
  },
  day: {
    width: windowWidth,
    alignItems: "center",
  },
  temperture: {
    fontSize: 120,
    marginTop: 60,
  },
  description: {
    fontSize: 60,
    marginTop: -30,
  },

})