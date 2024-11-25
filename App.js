import react, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator,
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';

// 날씨 아이콘
const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
}

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
        <Text style={styles.cityText}>Current location</Text>
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
              <View key={index} style={{ ...styles.day}}>

                  <View style={{flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"}}>
                    <Text style={styles.temperture}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                    <Fontisto name= {icons[day.weather[0].main]} size={80} color="black" style={{marginLeft: "30"}}/>
                  </View>

                  <View style={{alignItems: "center",
                    justifyContent: "center"}}>
                    <Text style={styles.description}>{day.weather[0].main}</Text>
                    <Text style={styles.tinyDescription}>{day.weather[0].description}</Text>
                    {index !== 4 && (
                    <Text style={styles.goToNextForecast}>Slide to see the next weather forecast →</Text>
                    )}
                  </View>
                
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
    backgroundColor: "#ADD8E6",
  },

  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cityText: {
    fontSize: 20,
    color: "#6C757D",
  },
  cityName: {
    marginTop: 10,
    fontSize: 40,
    fontWeight: 500,
  },

  weather: {
  },
  day: {
    width: windowWidth,
  },
  temperture: {
    fontSize: 100,
    marginTop: 60,
    left: 30,
  },
  description: {
    fontSize: 40,
    marginTop: -10,
  },
  tinyDescription: {
    fontSize: 20,
    color: "#6C757D",
  },
  goToNextForecast: {
    fontSize: 15,
    top: 120,
    color: "#6C757D",
  },

})