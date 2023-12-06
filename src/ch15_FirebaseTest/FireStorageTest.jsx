import React, { useState } from "react";
// 스토리지 공식 문서 , 샘플 코드 그대로 복사했고
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "./firebaseConfig";

import { v4 as uuidv4 } from "uuid"; // 랜덤 식별자를 생성해주는 라이브러리
// const storage = getStorage();
// storage: 파이어베이스 스토리지에 접근하기 위한 도구, 포인터, 인스턴스.
// 스토리지 저장소에 , 특정 경로를 만들기.
// reactStorage/

// 파일 선택하는 input , 보여주기 등.
const FireStorageTest = () => {
  const [attachment, setAttachment] = useState();
  const onFileChange = (evt) => {
    // 업로드 된 file
    const files = evt.target.files;
    const theFile = files[0];
    // FileReader 생성
    const reader = new FileReader();
    // file 업로드가 완료되면 실행
    reader.onloadend = (finishedEvent) => {
      // 업로드한 이미지 URL 저장
      const result = finishedEvent.currentTarget.result;
      setAttachment(result);
    };
    // 파일 정보를 읽기
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
  const onSubmit = async (evt) => {
    evt.preventDefault();
    /* 파일 업로드 */
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + uuidv4());
    // const fileRef = ref(storage, uuidv4());
    const response = await uploadString(storageRef, attachment, "data_url");
    console.log(response);
    /* 파일 다운로드 */
    const fileURL = await getDownloadURL(ref(storage, storageRef));
    console.log(fileURL);
    // 파일삭제
    //     const storage = getStorage();
    // const desertRef = ref(storage, fileURL); // 파일 참조 생성
    // deleteObject(desertRef);
  };
  return (
    <form onSubmit={onSubmit}>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" alt="" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
      <input type="submit" value="Upload" />
    </form>
  );
};

export default FireStorageTest;
