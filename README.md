# 🏠 Home Protector - 스마트 홈 제어 시스템

캡스톤 프로젝트로 개발된 React Native 기반의 스마트 홈 제어 모바일 애플리케이션입니다.

## 📋 프로젝트 개요

Home Protector는 가정 내 다양한 가전제품과 시설을 원격으로 제어할 수 있는 IoT 스마트 홈 시스템입니다. 사용자는 모바일 앱을 통해 에어컨, 보일러, 조명, 창문 등을 실시간으로 모니터링하고 제어할 수 있습니다.

## 🚀 주요 기능

### 🔐 사용자 인증
- 회원가입/로그인 시스템
- Apple Login, KakaoTalk Login 연동 (소셜 로그인)
- 비밀번호 찾기 기능

### 🏡 스마트 홈 제어
- **에어컨 제어**: 전원 on/off, 온도 조절, 실시간 온도 모니터링
- **보일러 제어**: 전원 관리 및 온도 설정
- **조명 제어**: 조명 on/off 제어
- **창문 제어**: 자동 창문 개폐 시스템
- **급수기 제어**: 물 공급 시스템 관리

### 📊 실시간 모니터링
- 실시간 온도/습도 데이터 수집
- 서버와의 5초 간격 데이터 동기화
- 직관적인 원형 게이지 UI로 상태 표시

### 🤖 자동 제어 시스템
- 환경 조건에 따른 자동 제어 기능
- 사용자 설정 기반 스마트 자동화

## 🛠 기술 스택

### Frontend (Mobile App)
- **React Native** 0.74.1
- **Expo** ^51.0.8
- **React Navigation** - 화면 네비게이션
- **React Native SVG** - 벡터 그래픽 및 게이지 UI
- **D3-Shape** - 원형 게이지 생성

### Backend Communication
- **Axios** - HTTP 클라이언트
- **STOMP.js** - WebSocket 통신
- **SockJS-Client** - 실시간 양방향 통신

### 상태 관리
- **AsyncStorage** - 로컬 데이터 저장
- **React Hooks** - 상태 관리

## 📂 프로젝트 구조

```
app_capstone-main/
├── assets/                    # 이미지 및 아이콘 리소스
│   ├── icon.png              # 앱 아이콘
│   ├── splash.png            # 스플래시 화면
│   ├── aircon.png            # 에어컨 아이콘
│   ├── heat.png              # 난방 아이콘
│   ├── light.png             # 조명 아이콘
│   ├── water.png             # 급수기 아이콘
│   ├── window.png            # 창문 아이콘
│   └── power.png             # 전원 버튼 아이콘
├── App.js                    # 메인 앱 컴포넌트 및 네비게이션
├── Login.js                  # 로그인 화면
├── Signup.js                 # 회원가입 화면
├── Controller.js             # 메인 제어 화면 (에어컨, 보일러, 조명 등)
├── Screen1.js                # 홈 대시보드 화면
├── AutoControl.js            # 자동 제어 설정 화면
├── package.json              # 프로젝트 의존성 및 스크립트
├── app.json                  # Expo 앱 설정
└── babel.config.js           # Babel 설정
```

## 🖥 주요 화면 구성

1. **로그인 화면** (`Login.js`)
   - 사용자 인증
   - 소셜 로그인 옵션
   - 회원가입 연결

2. **회원가입 화면** (`Signup.js`)
   - 새 계정 생성
   - 사용자 정보 입력

3. **홈 대시보드** (`Screen1.js`)
   - 전체 시스템 상태 개요
   - 각 제어 메뉴로의 접근

4. **메인 제어 화면** (`Controller.js`)
   - 에어컨, 보일러, 조명 통합 제어
   - 실시간 온도 모니터링
   - 직관적인 원형 게이지 UI

5. **자동 제어 화면** (`AutoControl.js`)
   - 스마트 자동화 설정
   - 조건별 자동 제어 규칙 설정

## ⚙️ 설치 및 실행

### 필수 요구사항
- Node.js (v14 이상)
- npm 또는 yarn
- Expo CLI
- Android Studio 또는 Xcode (실제 빌드용)

### 설치 과정

1. **저장소 클론**
   ```bash
   git clone [repository-url]
   cd app_capstone-main
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **앱 실행**
   ```bash
   # 개발 서버 시작
   npm start
   
   # Android에서 실행
   npm run android
   
   # iOS에서 실행
   npm run ios
   
   # 웹에서 실행
   npm run web
   ```

## 🌐 서버 연동

앱은 다음 서버 엔드포인트와 통신합니다:
- **Base URL**: `http://172.100.3.62:4000`
- **로그인**: `POST /member/loginl`
- **온도 데이터**: `GET /temperature`
- **에어컨 제어**: `POST /aircon/{on|off}`, `POST /aircon/updateTemp`
- **보일러 제어**: `POST /boiler/{on|off}`, `POST /boiler/updateTemp`

## 🎨 UI/UX 특징

- **직관적인 원형 게이지**: 온도 및 상태를 시각적으로 표현
- **실시간 업데이트**: 5초마다 서버 데이터 동기화
- **반응형 디자인**: 다양한 화면 크기 대응
- **Material Design**: 현대적이고 깔끔한 UI

## 📱 지원 플랫폼

- iOS
- Android
- Web (React Native Web)

## 👥 개발팀

캡스톤 프로젝트 팀에서 개발

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.

---

**Home Protector**로 더 스마트하고 편리한 홈 라이프를 경험해보세요! 🏠✨ 