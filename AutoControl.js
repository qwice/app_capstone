import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';
import axios from 'axios';

export default function AutoControl({ route }) {
  const { memberId } = route.params; // route.params에서 memberId를 가져옵니다.
  console.log("Received memberId in AutoControl:", memberId); // 로그 추가
  
  const [predictedTimes, setPredictedTimes] = useState([]); // predictedTimes를 배열로 수정
  const [temperatureAC, setTemperatureAC] = useState('21');
  const [temperatureBoiler, setTemperatureBoiler] = useState('24');
  const [isLightOn, setIsLightOn] = useState(false);
  const [isACOn, setIsACOn] = useState(true);
  const [isBoilerOn, setIsBoilerOn] = useState(true);

  useEffect(() => {
    const fetchPredictedTimes = async () => {
        if (!memberId) {
            console.log("No memberId provided");
            return;
        }

        try {
            console.log("Sending request with memberId:", memberId);
            const response = await axios.get(`http://172.100.3.62:4000/api/getPredictedTimesByMemberId`, {
                params: { memberId }
            });

            console.log("Received response:", response.data); // 응답 데이터 로그 추가

            if (response.data && response.data.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                const todayPredictedTimes = response.data.filter(item => item.date === today);
                setPredictedTimes(todayPredictedTimes);
            } else {
                console.log("No data returned for memberId:", memberId);
            }
        } catch (error) {
            console.error('Failed to fetch predicted times for memberId:', memberId, error);
        }
    };

    fetchPredictedTimes();
}, [memberId]);

  const saveTemperatures = async () => {
    try {
      await axios.post('http://172.100.3.62:4000/api/setAutoControlTemperature', {
        aircon: parseInt(temperatureAC),
        boiler: parseInt(temperatureBoiler)
      });
      console.log("Auto control temperatures updated");
    } catch (error) {
      console.error("Error updating auto control temperatures:", error);
    }
  };

  const predictedExitTime = predictedTimes.find(time => time.type === 'exit_time')?.time || '';
  const predictedEntryTime = predictedTimes.find(time => time.type === 'entry_time')?.time || '';

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.memberIdText}>{memberId}'s AutoControl</Text>
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <Text style={styles.title}>예측 출근 시간: {predictedExitTime}</Text>
          <Text>조명: OFF</Text>
          <Text>보일러 & 에어컨: OFF</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.title}>예측 퇴근 시간: {predictedEntryTime}</Text>
          <Text>조명: ON</Text>
          <View style={styles.controls}>
            <Text>에어컨: </Text>
            <Switch value={isACOn} onValueChange={setIsACOn} />
            <TextInput
              style={styles.input}
              value={temperatureAC}
              onChangeText={setTemperatureAC}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => console.log('Done Pressed')}
            />
            <Text>°C</Text>
          </View>
          <View style={styles.controls}>
            <Text>보일러: </Text>
            <Switch value={isBoilerOn} onValueChange={setIsBoilerOn} />
            <TextInput
              style={styles.input}
              value={temperatureBoiler}
              onChangeText={setTemperatureBoiler}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => console.log('Done Pressed')}
            />
            <Text>°C</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: '100%',
  },
  memberIdText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  timeContainer: {
    width: '100%',
    padding: 40,
    marginTop: 25,
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'stretch', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    width: 50,
    marginRight: 5,
    marginLeft: 20,
    textAlign: 'center',
  },

});
