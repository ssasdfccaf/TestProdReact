// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

/* 추가 설정 순서 1 */

// 스토어 임포트
import { getFirestore } from "@firebase/firestore";

// 스토리지 임포트
import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBICTsm2zoKXAC0fkFKOmAFusuth2x3GT4",
  authDomain:
    "[serverlesstestworld-1a8b2.firebaseapp.com](http://serverlesstestworld-1a8b2.firebaseapp.com/)",
  projectId: "serverlesstestworld-1a8b2",
  storageBucket:
    "[serverlesstestworld-1a8b2.appspot.com](http://serverlesstestworld-1a8b2.appspot.com/)",
  messagingSenderId: "191726172077",
  appId: "1:191726172077:web:735ce95c4b179b6c6e1324",
  measurementId: "G-QG5QMPCYEH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/* 간단한 파이어베이스 사용을 위한 초기 세팅 */

/* 추가 설정 순서 2 */

// store : 적용해서 내보내기 -> 다른 파일에서 임포트해서 사용 가능
export const db = getFirestore(app);

// storage : 적용해서 내보내기 -> 다른 파일에서 임포트해서 사용 가능
export const storage = getFirestore(app);

// const analytics = getAnalytics(app);
