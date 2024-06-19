import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://172.100.3.62:4000/member/loginl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ memberId: id, memberPassword: password }),
            });

            console.log('Sent data to the server:');
            console.log('Email:', id);
            console.log('Password:', password);

            const data = await response.json();

            console.log(data);

            if (data.success) {
                // 로그인 성공 처리
                Alert.alert(
                    'Login successful',
                    'Welcome!',
                    [
                        { 
                            text: '확인', 
                            onPress: () => navigation.navigate("Screen1", { memberId: id }) // memberId를 전달합니다.
                        },
                    ],
                    { cancelable: false }
                ); 
            }
             else {
                // 로그인 실패 처리
                Alert.alert('Login failed', 'Please check your username and password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <View>
            <Text style={style.welecome}>Welecome</Text>
            <Text style={style.to}>to Home Protector</Text>

            <TextInput
                placeholder="id"
                value={id}
                onChangeText={(text) => setId(text)}
                style={style.input}
            />
            <TextInput
                placeholder="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword} // 비밀번호 보기 상태에 따라 secureTextEntry 설정
                style={style.input}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={style.togglePasswordButton}>
                <Text style={style.togglePasswordButtonText}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleLogin()} style={style.find}>
                <Text style={style.find}>비밀번호 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLogin()} style={style.login}>
                <Text style={style.text}>로그인</Text>
            </TouchableOpacity>
            <View style={style.signup}>
                <Text style={style.ask}>계정이 없으신가요? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup", { screen: "Signup" })} >
                    <Text style={style.flex}>회원가입</Text>
                </TouchableOpacity>
            </View>
            <Text style={style.style}>------------------  간편 회원가입  ------------------</Text>
            <View style={style.another}>
                <TouchableOpacity onPress={() => navigation.navigate("Signup", { screen: "signup" })} style={style.apple}>
                    <Text style={style.appletext}>Apple Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Signup", { screen: "signup" })} style={style.kakao}>
                    <Text style={style.kakaotext}>KaKao Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login;

const style = StyleSheet.create({
    welecome: {
        marginTop: "20%",
        marginLeft: "5%",
        fontWeight: "700",
        fontSize: 40,
    },
    to: {
        marginLeft: "5%",
        fontWeight: "400",
        opacity: 0.3,
        fontSize: 25,
        marginBottom: "4%",
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
    find: {
        marginTop: "2%",
        marginLeft: "45%",
        opacity: 0.8,
        fontWeight: 'bold',
    },
    login: {
        backgroundColor: "black",
        marginTop: "7%",
        borderRadius: 15,
        height: 50,
        width: 330,
        alignSelf: "center",
        opacity: 0.85,
    },
    text: {
        textAlign: "center",
        justifyContent: "center",
        fontSize: 20,
        color: "white",
        padding: 15,
    },
    signup: {
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        marginTop: "3%",
    },
    ask: {
        opacity: 0.5,
    },
    flex: {
        marginLeft: "8%",
        color: "blue",
        fontWeight: "500",
    },
    style: {
        textAlign: "center",
        marginTop: "20%",
        opacity: 0.5,
    },
    another: {
        flexDirection: "row",
        marginTop: "6%",
    },
    apple: {
        backgroundColor: "white",
        width: 150,
        marginLeft: 26,
        marginRight: 13,
        borderRadius: 30,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    appletext: {
        color: "black",
        textAlign: "center",
        fontSize: 20,
        padding: 15,

    },
    kakao: {
        backgroundColor: "white",
        width: 150,
        marginLeft: 12,
        borderRadius: 30,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    kakaotext: {
        color: "black",
        textAlign: "center",
        fontSize: 20,
        padding: 15,
    },
    togglePasswordButton: {
        position: "absolute",
        top: "49%",
        right: "12%",
        transform: [{ translateY: -25 }], // 버튼을 수직 중앙 정렬
    },
    togglePasswordButtonText: {
        color: "blue",
        fontWeight: "500",
    },
})
