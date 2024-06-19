import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [number, setNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://172.100.3.62:4000/member/savel', {
                memberName: name,
                memberId: id,
                memberPassword: password
            });
    
            console.log('Sent data to the server:');
            console.log('Name:', name);
            console.log('Email:', id);
            console.log('Password:', password);
    
            console.log('Response from server:', response.data);
            const data = response.data;
    
            if (data.success === false) {
                Alert.alert('이미 존재하는 아이디 입니다.');
            } else if (data.success === true) {
                Alert.alert('회원가입 성공!');
                navigation.navigate('Login');
            }
            // 성공 또는 실패에 따라 적절한 처리를 수행합니다.
        } catch (error) {
            console.error('Signup failed', error);
        }
    };
        

    return(
        <View style={style.main0}>
            <Text style={style.main1}>Home Protector</Text>
            <Text style={style.main2}>회원가입</Text>
            <TextInput
                placeholder="이름"
                value={name}
                onChangeText={(text) => setName(text)}
                style={style.input}
            />
            <TextInput
                placeholder="아이디"
                value={id}
                onChangeText={(text) => setId(text)}
                style={style.input}
            />
            <TextInput
                placeholder="비밀번호"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword} // 비밀번호 보기 상태에 따라 secureTextEntry 설정
                style={style.input}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={style.togglePasswordButton}>
                <Text style={style.togglePasswordButtonText}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>

            <TextInput
                placeholder="휴대폰 번호"
                value={phonenumber}
                onChangeText={(text) => setPhonenumber(text)}
                style={style.input}
            />
            <TextInput
                placeholder="인증번호"
                value={number}
                onChangeText={(text) => setNumber(text)}
                style={style.input}
            />
            <TouchableOpacity onPress={() => handleSignup()} style={style.signup1}>
                <Text style={style.signup2}>회원가입</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Signup

const style=StyleSheet.create({
    main0: {
        backgroundColor: "white",
        borderRadius: 15,
        height: 180,
        shadowColor: 'gray',
        shadowOffset: { width: 3, height: 8 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    main1: {
        marginTop: "20%",
        marginLeft: "5%",
        fontWeight: "bold",
        fontSize: 20,
    },
    main2: {
        marginTop: "3%",
        marginLeft: "5%",
        marginBottom: "20%",
        fontWeight: "bold",
        fontSize: 17,
    },
    input: {
        marginTop: "5%",
        marginLeft: "5%",
        height: 50,
        width: 330,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: "white",
        borderRadius: 15,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    togglePasswordButton: {
        position: "absolute",
        top: "221%",
        right: "12%",
        transform: [{ translateY: -25 }], // 버튼을 수직 중앙 정렬
    },
    togglePasswordButtonText: {
        color: "blue",
        fontWeight: "500",
    },
    signup1: {
        backgroundColor: "black",
        width: 300,
        height: 50,
        borderRadius: 30,
        alignSelf: "center",
        marginTop: "10%",
    },
    signup2: {
        padding: 15,
        color: "white",
        textAlign: "center",
        justifyContent: "center",
        fontSize: 20,

    },
})