import React from "react";

// 샘플 테스트,
// 간단히 입력값 2개정도, username, password
// crud 확인.
// 파이어베이스 콘솔에 들어가서, 우리가 이용할 서비스를 시작하고,
// 사용 규칙은 일단은 테스트 모드(사용기간 30일 제한), 프로덕션 모드(배포)
// 스토어, 스토리지 오픈.

// 스토어

// 준비작업 샘플 테스트 1
// import
import { db } from "./firebaseConfig";

// 공식 문서 샘플 코드를 그대로 가져온 경우.
// https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko#web-modular-api
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Button } from "antd";

// Add a new document in collection "cities"

const FireStoreTest = () => {
  // 샘플 확인용.
  const testSetDoc = async () => {
    //db : 파이어베이스 스토어 의미, 이용하기위한 초기값이 들어 있는 인스턴스
    // cities : 컬렉션,(테이블과 동일 역할)
    // LA : 문서의 아이디 부분, 보통은 자동아이디로 가능한데.
    // 문서 아이디는 pk 형식으로 되어야해서, 중복이 되지 않게 설계해야함.
    // 자바스크립트 객체 형태의 값이 추가되었음.
    await setDoc(doc(db, "cities", "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
    });
  };

  // 데이터 가져오기. 샘플
  const testGetDoc = async () => {
    // db : 공통 도구,
    // cities : 컬렉션에 있는
    // LA 문서를 가져올 예정.
    const docRef = doc(db, "cities", "LA");
    // docSnap 실제 데이터가 존재함, 객체 형태로
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  // 공식 문서 샘플 코드
  // 임포트 상위에 있어야 함, 이동하기.
  // import { doc, getDoc } from "firebase/firestore";

  // 문서 아이디 자동으로 하는 addDoc
  // import { collection, addDoc } from "firebase/firestore";

  // Add a new document with a generated id.
  const testAddDoc = async () => {
    const docRef = await addDoc(collection(db, "cities"), {
      name: "Tokyo",
      country: "Japan",
      regDate: Timestamp.fromDate(new Date()),
    });
    console.log("Document written with ID: ", docRef.id);
  };

  // update
  // import { doc, updateDoc } from "firebase/firestore";

  const testUpdateDoc = async () => {
    const LARef = doc(db, "cities", "LA");
    // Set the "capital" field of the city 'DC'
    await updateDoc(LARef, {
      capital: false,
      name: "lsy",
      regDate: Timestamp.fromDate(new Date()),
    });
  };

  // delete
  //import { doc, deleteDoc } from "firebase/firestore";

  const testDeleteDoc = async () => {
    await deleteDoc(doc(db, "cities", "LA"));
  };

  return (
    <div>
      <Button type="primary" onClick={() => testSetDoc()}>
        Test setDoc
      </Button>
      &nbsp;&nbsp;
      <Button type="primary" onClick={() => testGetDoc()}>
        Test getDoc
      </Button>
      &nbsp;&nbsp;
      <Button type="primary" onClick={() => testAddDoc()}>
        Test addDoc
      </Button>
      &nbsp;&nbsp;
      <Button type="primary" onClick={() => testUpdateDoc()}>
        Test updateDoc
      </Button>
      &nbsp;&nbsp;
      <Button type="primary" onClick={() => testDeleteDoc()}>
        Test deleteDoc
      </Button>
    </div>
  );
};

export default FireStoreTest;
