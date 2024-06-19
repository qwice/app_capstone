import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from "react-native";
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { arc } from 'd3-shape';
import axios from "axios";

const AirconControl = ({ temperature, setTemperature }) => {
  const [aisOn, setAisOn] = useState(false);
  const [temp, setTemp] = useState(null);
  const startAngle = 2 * Math.PI; // 12시 방향
  const endAngle = startAngle + ((temperature - 21) / 25) * Math.PI * 2; // 21도에서 35도 사이

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://172.100.3.62:4000/temperature");
        const data = response.data;
        setTemp(data.temperature);
      } catch (error) {
        console.error('Error fetching temperature and humidity:', error);
      }
    };

    const intervalId = setInterval(fetchData, 5000); // 5초마다 서버에 요청
    fetchData(); // 초기 데이터 가져오기
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시에 interval 정리
  }, []);

  const arcGenerator = arc()
    .innerRadius(90)
    .outerRadius(110)
    .startAngle(startAngle)
    .endAngle(endAngle);

    //ON/OFF할 때 서버로 POST
    const togglePower = async() => {
      setAisOn(!aisOn);
      const url = `http://172.100.3.62:4000/aircon/${aisOn ? 'off' : 'on'}`;
        try {
          await axios.post(url);
          setAisOn(!aisOn);
        } catch (error) {
          console.error("Failed to toggle LED", error);
        }
    };
  
  //온도 조절할 때 온도 값 서버로 POST
  const increaseTemp = async () => {
    if (temperature < 35) {
      const newTemp = temperature + 1;
      setTemperature(newTemp);
      try {
        const response = await axios.post(`http://172.100.3.62:4000/aircon/updateTemp`, { temperature: newTemp });
        console.log('Server response:', response.data)
      } catch (error) {
        console.error('Error updating temperature:', error);
      }
    }
  };

  const decreaseTemp = async () => {
    if (temperature > 10) {
      const newTemp = temperature - 1;
      setTemperature(newTemp);
      try {
        const response = await axios.post(`http://172.100.3.62:4000/aircon/updateTemp`, { temperature: newTemp });
        console.log('Server response:', response.data)
      } catch (error) {
        console.error('Error updating temperature:', error);
      }
    }
  };

  return (
    <>
      <View style={styles.svgContainer}>
        <Svg width="220" height="220">
          <G x="110" y="110">
            <Circle r={100} fill="none" stroke="#ccc" strokeWidth={5} />
            <Path d={arcGenerator()} fill="gray" />
            <SvgText
              x="0"
              y="-40"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="20" // 글씨 크기 조정
              // fontWeight="bold"
              fill="#000" // 텍스트 색상 설정
            >
              현재 상태
            </SvgText>
            <SvgText
              x="0"
              y="0"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="30" // 글씨 크기 조정
              fontWeight="bold"
              fill="#000" // 텍스트 색상 설정
            >
              {aisOn ? "ON" : "OFF"}
            </SvgText>
            <SvgText
              x="-30"
              y="40"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="20" // 글씨 크기 조정
              // fontWeight="bold"
              fill="#000" // 텍스트 색상 설정
            >
              온도 : {temp}°C
            </SvgText>
          </G>
        </Svg>
      </View>
      <Text style={styles.temperatureText}>{temperature}°C</Text>

      <View style={styles.controlsBox}>
        <TouchableOpacity style={styles.controlButton} onPress={increaseTemp}>
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={decreaseTemp}>
          <Text style={styles.controlText}>-</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={[
            styles.turnOnButton,
            { backgroundColor: aisOn ? "black" : "gray" },
          ]}
          onPress={togglePower}
        >
          <Image
            source={require('./assets/power.png')}
            style={[styles.icon, { tintColor: 'white' }]}
          />
          <Text style={styles.turnOnText}>{aisOn ? "Turn Off" : "Turn On"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const BoilerControl = ({ temperature, setTemperature }) => {
  const [temp, setTemp] = useState(null);
  const [bisOn, setBisOn] = useState(false);
  const startAngle = 2 * Math.PI; // 12시 방향
  const endAngle = startAngle + ((temperature - 24) / (35 - 10)) * Math.PI * 2; // 24도에서 35도 사이

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://172.100.3.62:4000/temperature");
        const data = response.data;
        setTemp(data.temperature);
      } catch (error) {
        console.error('Error fetching temperature and humidity:', error);
      }
    };

    const intervalId = setInterval(fetchData, 5000); // 5초마다 서버에 요청
    fetchData(); // 초기 데이터 가져오기
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시에 interval 정리
  }, []);

  const arcGenerator = arc()
    .innerRadius(90)
    .outerRadius(110)
    .startAngle(startAngle)
    .endAngle(endAngle);

  //ON/OFF할 때 서버로 POST
  const togglePower = async() => {
    setBisOn(!bisOn);
    const url = `http://172.100.3.62:4000/boiler/${bisOn ? 'off' : 'on'}`;
      try {
        await axios.post(url);
        setBisOn(!bisOn);
      } catch (error) {
        console.error("Failed to toggle LED", error);
      }
  };

  //온도 조절할 때 온도 값 서버로 POST
  const increaseTemp = async () => {
    if (temperature < 35) {
      const newTemp = temperature + 1;
      setTemperature(newTemp);
      try {
        await axios.post(`http://172.100.3.62:4000/boiler/updateTemp`, { temperature: newTemp });
      } catch (error) {
        console.error('Error updating temperature:', error);
      }
    }
  };
  
  const decreaseTemp = async () => {
    if (temperature > 10) {
      const newTemp = temperature - 1;
      setTemperature(newTemp);
      try {
        await axios.post(`http://172.100.3.62:4000/boiler/updateTemp`, { temperature: newTemp });
      } catch (error) {
        console.error('Error updating temperature:', error);
      }
    }
  };

  return (
    <>
      <View style={styles.svgContainer}>
        <Svg width="220" height="220">
          <G x="110" y="110">
            <Circle r={100} fill="none" stroke="#ccc" strokeWidth={5} />
            <Path d={arcGenerator()} fill="gray" />
            <SvgText
              x="0"
              y="-40"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="20" // 글씨 크기 조정
              // fontWeight="bold"
              fill="#000" // 텍스트 색상 설정
            >
              현재 상태
            </SvgText>
            <SvgText
              x="0"
              y="0"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="30" // 글씨 크기 조정
              fontWeight="bold"
              fill="#000" // 텍스트 색상 설정
            >
              {bisOn ? "ON" : "OFF"}
            </SvgText>
            <SvgText
              x="-30"
              y="40"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="20" // 글씨 크기 조정
              // fontWeight="bold"
              fill="#000" // 텍스트 색상 설정
            >
              온도 : {temp}°C
            </SvgText>
          </G>
        </Svg>
      </View>
      <Text style={styles.temperatureText}>{temperature}°C</Text>

      <View style={styles.controlsBox}>
        <TouchableOpacity style={styles.controlButton} onPress={increaseTemp}>
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={decreaseTemp}>
          <Text style={styles.controlText}>-</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={[
            styles.turnOnButton,
            { backgroundColor: bisOn ? "black" : "gray" },
          ]}
          onPress={togglePower}
        >
          <Image
            source={require('./assets/power.png')}
            style={[styles.icon, { tintColor: 'white' }]}
          />
          <Text style={styles.turnOnText}>{bisOn ? "Turn Off" : "Turn On"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const Temperature = () => {
  const [airconTemperature, setAirconTemperature] = useState(21);
  const [boilerTemperature, setBoilerTemperature] = useState(24);
  const [activeTab, setActiveTab] = useState("aircon");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.temperatureBox}>
        <Text style={styles.title}>Temperature</Text>
      </View>

      <View style={styles.icons}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={[styles.iconButton, activeTab === "aircon" && styles.activeIconButton]}
            onPress={() => setActiveTab("aircon")}
          >
            <Image source={require('./assets/aircon.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.iconText}>에어컨</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={[styles.iconButton, activeTab === "boiler" && styles.activeIconButton]}
            onPress={() => setActiveTab("boiler")}
          >
            <Image source={require('./assets/heat.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.iconText}>보일러</Text>
        </View>
      </View>

      {activeTab === "aircon" ? (
        <AirconControl
          temperature={airconTemperature}
          setTemperature={setAirconTemperature}
        />
      ) : (
        <BoilerControl
          temperature={boilerTemperature}
          setTemperature={setBoilerTemperature}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // 여기에 배경색을 흰색으로 설정
  },
  temperatureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    marginBottom: 25,
    width: "100%",
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  title: {
    marginTop: "18%",
    marginBottom: "5%",
    textAlign: 'center',
    fontWeight: "500",
    fontSize: 25,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: "10%",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconButton: {
    marginTop: "5%",
    marginLeft: "5%",
    height: 60,
    width: 60,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  activeIconButton: {
    backgroundColor: '#ddd',
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconText: {
    marginTop: 10,
    textAlign: "center",
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureText: {
    fontSize: 50,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: "35%",
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  controlsBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  controlButton: {
    backgroundColor: "#ddd",
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 24,
  },
  turnOnButton: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 15,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 45,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  turnOnText: {
    color: "white",
    fontSize: 20,
    marginLeft: 5
  }
});

export default Temperature;