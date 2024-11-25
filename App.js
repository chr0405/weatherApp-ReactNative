import react, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator,
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';

// 휴대폰 화면 가로 길이를 측정
const windowWidth = Dimensions.get('window').width;

const API_KEY = "cc35a814afcef2ccce0efacba365e6a8"

export default function App() {

  // 접근 허가
  const [ok, setOk] = useState(true);

  // 주소
  const [city, setCity] = useState("🌐..");
  const [district, setDistrict] = useState("");

  // 일별 날씨 정보
  const [days, setDays] = useState([]);

  const getWeather = async() => {
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

    // 날씨 정보를 가져온다
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.list.filter((weather) => {
        if (weather.dt_txt.includes("03:00:00")) {
          return weather;
        }
      }));
  }

  useEffect(()=> {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>

      <StatusBar backgroundColor="black"></StatusBar>

      <View style={styles.city}>
      
        <Text style={styles.cityName}>{city} {district}</Text>
      
      </View>

      <ScrollView pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        
        { days.length === 0? 
        
          // 날씨 정보를 불러오지 못했다면
          (<View style={styles.day}>
      
            <ActivityIndicator size="large" color="black" style={{marginTop : 10}}/>
        
          </View>)
          
          : 
          
          // 날씨 정보를 불러왔다면
          (
            days.map((day, index) => 
              <View key={index} style={styles.day}>
                <Text style={styles.temperture}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyDescription}>{day.weather[0].description}</Text>
              </View>
            )
          )
        }
      
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
    // alignItems: "center",
    left: 30,
  },
  temperture: {
    fontSize: 100,
    marginTop: 60,
  },
  description: {
    fontSize: 60,
    marginTop: -30,
  },
  tinyDescription: {
    fontSize: 20,
    marginTop: -10,
  },

})