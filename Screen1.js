import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Modal, Text, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

// Icons
const LightingIcon = require('./assets/light.png');
const TemperatureIcon = require('./assets/hot.png');
const WindowIcon = require('./assets/window.png');
const HumidityIcon = require('./assets/water.png');

export default function Screen1({ route }) {
  const { memberId } = route.params; // route.params에서 memberId를 가져옵니다.
  console.log("Received memberId in Screen1:", memberId); // 로그 추가

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [switchValues, setSwitchValues] = useState({
    '조명': false,
    '온도': false,
    '창문': false,
    '습도': false,
  });
  const [controlMode, setControlMode] = useState("제어 모드 선택");
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://172.100.3.62:4000/temperature");
        const data = response.data;
        setHumidity(data.humidity);
      } catch (error) {
        console.error('Error fetching temperature and humidity:', error);
      }
    };

    const intervalId = setInterval(fetchData, 5000); // 5초마다 서버에 요청
    fetchData(); // 초기 데이터 가져오기
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시에 interval 정리
  }, []);

  const navigation = useNavigation();

  const iconGroups = [
    { name: '조명', icon: LightingIcon },
    { name: '온도', icon: TemperatureIcon },
    { name: '창문', icon: WindowIcon },
    { name: '습도', icon: HumidityIcon },
  ];

  const handleIconPress = (iconName) => {
    if (iconName === '온도') {
      // 온도 모달을 누르면 온도 페이지로 넘어가도록하깅..
      navigation.navigate("Controller", { screen: "Controller"})
      return;
    }
    setSelectedIcon(iconName);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleBoxPress = () => {
    setSelectedIcon(null);
    setModalVisible(true);
  };

  // const onSwitchChange = async (iconName) => { //iconname == 조명 , 창문
  //   setSwitchValues((prevState) => ({
  //     ...prevState,
  //     [iconName]: !prevState[iconName],
  //   }));

  const onSwitchChange = async (iconName) => {
    const newSwitchValue = !switchValues[iconName];
    
    setSwitchValues((prevState) => ({
      ...prevState,
      [iconName]: newSwitchValue,
    }));
    
    if (iconName === '조명') {
      try {
        await axios.post('http://172.100.3.62:4000/lights/control', {
          status: newSwitchValue ? 'on' : 'off'
        });
        console.log('조명 상태 변경됨:', newSwitchValue ? 'on' : 'off');
      } catch (error) {
        console.error('Error sending light status to the server:', error);
      }
    }

    if (iconName === '창문') {
      try {
        await axios.post('http://172.100.3.62:4000/windows/control', {
          status: newSwitchValue ? 'on' : 'off'
        });
        console.log('창문 상태 변경됨:', newSwitchValue ? 'on' : 'off');
      } catch (error) {
        console.error('Error sending window status to the server:', error);
      }
    }
  };

  const handleControlModeSelect = async (mode) => {
    setControlMode(mode);
    setModalVisible(false);
    try {
      const response = await axios.post('http://172.100.3.62:4000/api/setMode', { mode });
      console.log('Control mode set to:', response.data);
    } catch (error) {
      console.error('Error setting control mode:', error);
    }
  
    if (mode === '자동 제어 모드') {
      navigation.navigate('AutoControl', { memberId });
    }
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.controllerTop}>
        <Text style={styles.title}>Controller</Text>
      </View>
      <TouchableOpacity onPress={handleBoxPress} style={styles.boxContainer}>
        <View style={styles.boxWrapper}>
          <Text style={styles.boxText}>현재 상태</Text>
          <Text style={styles.controlText}>{controlMode}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.row}>
        {iconGroups.slice(0, 2).map((iconData) => (
          <TouchableOpacity
            key={iconData.name}
            onPress={() => handleIconPress(iconData.name)}
            style={styles.iconContainer}
          >
            <View style={styles.iconWrapper}>
              <Image
                source={iconData.icon}
                style={styles.icon}
              />
              <Text style={styles.iconText}>{iconData.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {iconGroups.slice(2).map((iconData) => (
          <TouchableOpacity
            key={iconData.name}
            onPress={() => handleIconPress(iconData.name)}
            style={styles.iconContainer}
          >
            <View style={styles.iconWrapper}>
              <Image
                source={iconData.icon}
                style={styles.icon}
              />
              <Text style={[styles.iconText, { fontSize: 14 }]}>{iconData.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && selectedIcon !== null}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          {selectedIcon === '습도' ? (
              <View>
                <Image
                  source={HumidityIcon}
                  style={styles.selectedIcon}
                />
                <Text style={styles.modalText}>현재 습도: {humidity}%</Text> 
              </View>     // 서버에서 습도 값 받아와서 띄우기
            ) : (
              <View>
                <Image
                  source={selectedIcon ? iconGroups.find((icon) => icon.name === selectedIcon).icon : null}
                  style={styles.selectedIcon}
                />
                <Text style={styles.modalText}>{selectedIcon}</Text>
                <View style={{ alignItems: 'center' }}>
                <Switch
                  onValueChange={() => onSwitchChange(selectedIcon)}
                  value={switchValues[selectedIcon]}
                />
               </View>
              </View>
            )}
            <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && selectedIcon === null}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { fontWeight: 'bold', color: 'black' }]}>제어 모드 선택</Text>
            <TouchableOpacity onPress={() => handleControlModeSelect('수동 제어 모드')} style={styles.controlModeButton}>
              <Text style={[styles.controlModeButtonText, { color: 'black' }]}>수동 제어 모드</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleControlModeSelect('자동 제어 모드')} style={styles.controlModeButton}>
              <Text style={[styles.controlModeButtonText, { color: 'black' }]}>자동 제어 모드</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  controllerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    marginBottom: 50,
    width: "100%",
    height: 135,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  Box: {
    backgroundColor: "black", 
    borderRadius: 15, 
    padding: 10, 
    marginBottom: 2, 
    width: "0.6", 
    shadowColor: 'gray', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 2, 
    marginTop: 50, 
    marginLeft: 20
  },
  title: {
    marginTop: "18%",
    marginBottom: "5%",
    textAlign: 'center',
    fontWeight: "500",
    fontSize: 25,
  },
  boxContainer: {
    width: 290,
    height: 135,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#EAEAEA',
    backgroundColor: 'white',
    marginBottom: 40,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  boxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    padding: 10,
  },
  boxText: {
    textAlign: 'center',
    fontSize: 15,
    marginRight:200,
    marginTop:-20,
    marginBottom: 40,
  },
  controlText:{
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
    marginBottom:20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'center',
    margin: 10,
  },
  iconWrapper: {
    width: 135,
    height: 135,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#EAEAEA',
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  icon: {
    width: 60,
    height: 60,
  },
  iconText: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: 200,
    height: 250,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    width: 80,
    height: 80,
  },
  modalText: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  controlModeButton:{
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    width: '70%',
    height:40,
    alignItems: 'center',
  },
  controlModeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
