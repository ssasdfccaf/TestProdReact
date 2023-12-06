import React, { useState, useEffect, useRef } from "react";
import {
  ref, // 선택된 이미지 의 인스턴스,
  uploadBytesResumable, // 이미지 파일을 업로드 시 진행상황을 보거나, 중단, 재개 함수
  getDownloadURL, // 스토리지의 저장된 파일의 URL 주소를 반환하는 함수.
  deleteObject, // 스토리지의 이미지 파일을 삭제하는 함수
} from "firebase/storage";
// https://www.npmjs.com/package/rc-progress
import { Line, Circle } from "rc-progress";

import { storage } from "./firebaseConfig";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// 랜덤한 문자열 만들기.
import { v4 as uuidv4 } from "uuid";

// 준비물
// 출처 : 블로그
// https://mingeesuh.tistory.com/entry/Firebase-%EC%9B%B9-%ED%8C%8C%EC%9D%B4%EC%96%B4%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%A7%80-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C-%EB%B0%8F-%EB%A7%81%ED%81%AC-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0

// 문제점 : 멀티 이미지를 선택 후, 업로드시, 동작을 안하고,
// 업로드 버튼을 한번더 눌러야 진행이 되었음. -> 고치고,

// yarn add rc-progress : 이미지 업로드시, 진행 상황을 시각적으로 표시 진행바로.
// yarn add uuid : 파일 이름을 정할 때, 랜덤한 문자열 특정 길이로 작성.
// 나머지 코드는 제가 복붙해서, 설명 후, 기능 설명.
// 추가 작업,
// 스토리지 사진 업로두 후, 파이어 스토어에 해당 사진의 url 주소를 등록 했고,
// 등록 된 사진이 리스트에 출력하고,
// 각각 의 사진의 삭제 기능을 일단 추가.
// 수정, 멀티 이미지

const FireStorageMultiTest = () => {
  // 스토어에서 받아온 이미지들의 url 주소가 다 담겨져 있음.
  const [images, setImages] = useState([]);
  const [files, setFileList] = useState([]); // 파일 리스트, 스토리지 업로드시 선택된 사진들
  const [isUploading, setUploading] = useState(false); // 업로드 상태
  const [photoURL, setPhotosURL] = useState([]); // 업로드 완료된 사진 링크들
  const [progress, setProgress] = useState(0); // 업로드 진행상태
  // 파일 선택시 파일리스트 상태 변경해주는 함수
  // 선택된 여러 이미지를 배열로 담아두기.
  const handleImageChange = (e) => {
    for (const image of e.target.files) {
      setFileList((prevState) => [...prevState, image]);
    }
  };
  //파이어베이스 스토어, 스토리지에 저장된 이미지 이름 저장하는 스토어 컬렉션 참조
  const imagesCollectionRef = collection(db, "testImages");

  //최초 1회시 스토어에서, 이미지 컬렉션 데이터 모두 가져오기.
  useEffect(() => {
    // 비동기로 데이터 받을준비
    const getImages = async () => {
      // getDocs로 컬렉션안에 데이터 가져오기
      const data = await getDocs(imagesCollectionRef);
      // testImages의  data안의 자료 추가. 객체에 id 덮어씌우는거
      setImages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getImages();
    // console.log("images : " + images[0].imgUrl);
  }, []);
  const getImages = async () => {
    // getDocs로 컬렉션안에 데이터 가져오기
    const data = await getDocs(imagesCollectionRef);
    // users에 data안의 자료 추가. 객체에 id 덮어씌우는거
    setImages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // 디비(스토어), 이미지의  url 저장하기.
  const createImage = async (downurl) => {
    // addDoc을 이용해서 내가 원하는 collection에 내가 원하는 key로 값을 추가한다.
    // await addDoc(imagesCollectionRef, { imgUrl: downurl, regDate: showDate() });
    await addDoc(imagesCollectionRef, {
      fileName: "testName" + uuidv4(),
      imgUrl: downurl,
      regDate: Timestamp.fromDate(new Date()),
    });
    getImages();
    setFileList([]);
  };
  // 스토어 이미지 삭제
  const deleteImage = async (id) => {
    // 내가 삭제하고자 하는 db의 컬렉션의 id를 뒤지면서 데이터를 찾는다
    const imageDoc = doc(db, "testImages", id);
    // deleteDoc을 이용해서 삭제
    await deleteDoc(imageDoc);
  };
  // 스토리지 이미지 삭제
  const deleteStorageImage = async (imgUrl) => {
    const delImageRef = ref(storage, imgUrl);
    // Delete the file
    await deleteObject(delImageRef)
      .then(() => {
        // File deleted successfully
        getImages();
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };
  const showDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    const dateString = year + "-" + month + "-" + day;
    const hours = ("0" + today.getHours()).slice(-2);
    const minutes = ("0" + today.getMinutes()).slice(-2);
    const seconds = ("0" + today.getSeconds()).slice(-2);
    const timeString = hours + ":" + minutes + ":" + seconds;
    const fullTime = dateString + timeString;
    return fullTime;
  };
  // 업로드시 호출될 함수
  // e : event, fileList : 선택한 이미지들
  const handleImageUpload = async (e, fileList) => {
    e.preventDefault();
    try {
      setUploading(true);
      await Promise.all(
        fileList.map((file) => {
          // 스토리지 어디에 저장되게 할껀지 참조 위치를 지정. 아래와 같이 지정해줄시 images 폴더에 파일이름으로 저장
          const storageRef = ref(storage, `images/${uuidv4()}${file.name}`);
          const task = uploadBytesResumable(storageRef, file);
          // 업로드 진행률을 모니터링, 업로드 진행률 퍼센트로 상태 지정
          task.on(
            "state_changed",
            (snapshot) => {
              setProgress(
                Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
              );
            },
            (error) => {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case "storage/unauthorized":
                  // User doesn't have permission to access the object
                  break;
                case "storage/canceled":
                  // User canceled the upload
                  break;
                case "storage/unknown":
                  // Unknown error occurred, inspect error.serverResponse
                  break;
              }
            },
            () => {
              // 이미지 스토리지에 업로드 성공하면, then
              getDownloadURL(task.snapshot.ref).then((downloadURL) => {
                // 스토어라는 저장소에 이미지 URL 주소를 등록 하는 구조.
                createImage(downloadURL);
                setProgress(0);
              });
            }
          );
        })
      );
      setPhotosURL(images);
      // setFileList([]);
      alert("성공적으로 업로드 되었습니다");
      console.log("photoURL1 : " + photoURL);
      // console.log("urltest2 : " + urltest2);
      console.log("images : " + images);
    } catch (err) {
      console.error(err);
    }
    // 초기화
    setProgress(0);
    setUploading(false);
    inputElement.current.value = "";
    console.log("photoURL2 : " + photoURL);
    console.log("images2 : " + images);
  };
  //순서2 , useRef, 설정1
  const inputElement = useRef(null);
  return (
    <div>
      <form onSubmit={(e) => handleImageUpload(e, files)}>
        {/* rc-progress의 Line 컴포넌트로 파일 업로드 상태 표시 */}
        <Line percent={progress} strokeWidth={2} strokeColor="#ff567a" />
        {/* <Circle
          percent={progress}
          trailWidth={2}
          strokeWidth={1}
          strokeColor="#267132dc"
        /> */}
        <label>
          파일:
          <input
            multiple
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            ref={inputElement}
          />
        </label>
        <button type="submit">{isUploading ? "업로드중..." : "업로드"}</button>
      </form>
      {images.length > 0 && (
        <div>
          <h1>업로드한 결과 이미지</h1>
          <ul>
            {images.map((url, index) => (
              <li key={index}>
                <img
                  style={({ width: "200px" }, { height: "150px" })}
                  src={url.imgUrl}
                  alt="사용자 첨부 이미지"
                />
                <button
                  onClick={() => {
                    //삭제시, 스토어에서 삭제 하고, 또 스토리지도 같이 삭제 필요.
                    deleteImage(url.id);
                    deleteStorageImage(url.imgUrl);
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FireStorageMultiTest;
