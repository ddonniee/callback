import React, { useEffect, useState, useContext } from "react";
import imageCompression from 'browser-image-compression';
import $, { param } from 'jquery';
import { Fade } from "react-reveal";
import { useLocation,useParams } from "react-router-dom";
import styled from "styled-components";
import * as config from '../config'

// components
import Top from "./Top";
import Button from "./Button";
import Alert from "./Alert";
import Loader from "./Loader";
import { AppContext } from "../App";
// imgs
import Camera from '../public/svg/camera.svg'

export default function CreateMSG(props) {

    const values = useContext(AppContext);
    const [attached, setAttached] = useState([])
    const [strLength, setStrLength] = useState(0);
    const [theme, setTheme] = useState(props.theme)
    const [userId, setUserId] = useState(values.user);
    const [cardId, setCardId] = useState(-1);
    const [isUploading, setIsUploading] = useState(false);

    let params = useParams()
    
    const [curData, setCurData] = useState({});

    const [method, setMethod] = useState({
      way:'POST',
      id:'addForm',
    });
    const [imgList, setImgList] = useState();
    const [imgUrlList, setImgUrlList] = useState([]);
    const [compressedFile, setCompressedFile] = useState([]);
   
    // 사용자 입력 데이터
    const [value, setValue] = useState('');
    const [openAlert, setOpenAlert] = useState(false)
    const [alertDetail, setAlertDetail] = useState({
        title:"",
        message:"",
        close:false,
        lists:[],
        confirm:false,
        onClick:null,
        color:theme.btnColor,
    });
    useEffect(()=>{

      if (params.id!==undefined) {
        setUserId(params.id);
        setCardId(params.id2);

        } else {
        setUserId(values.user);
        setCardId(-1);
        }
    },[])
    useEffect(()=>{
      if(openAlert) {
        setTimeout(()=>{
          setIsUploading(false)
        },1000)
      } 
    },[openAlert])
    // params에 card_id 존재할때는 편집하기 모드이므로 데이터 통신 필요
    useEffect(()=>{
      if(cardId!==-1) {
        fetch(config.URL_ADDRESS+config.SEARCH_CALLBACK_LIST+'/'+userId+'/'+cardId, {
          mode:'cors',
          headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + values.token,
          }
        })
        .then (res=>{
          return res.json();
        })
        .then (data=> {
          setCurData(data[0])
          setValue(data[0].content)
          setStrLength(data[0].content.length > 1000 ? 1000 : data[0].content.length )
          let imgArr = []
          for(let i=0; i<5; i++) {
            let temp = 'img_path'
            temp = temp+(i+1)
            if(data[0][temp] !== null) {
              imgArr[i]=data[0][temp]
            }
          }
          let arrToString = imgArr.toString();
          setImgUrlList(imgArr)
          setAttached(arrToString) 
        })
          let copy = method;
          setMethod({
            ...copy,
            way:'PATCH',
            id:'editForm'
          })
    }
    },[cardId])

    /**
     * 함수명 : onAddCard
     * 함수작성자 : 이은정
     * 기능 : 콜백 함수 새로 생성하는 함수
     */
    const onAddCard=()=>{
      setIsUploading(true)
      var formData = new FormData();
        formData.append('user_id',values.user);
        formData.append('content', value);
        for(let i=0; i<compressedFile.length; i++) {
          formData.append('file',compressedFile[i])
        }
        fetch(config.URL_ADDRESS+config.ADD_CARD, {
        method: 'POST',
        mode:'cors',
        headers: {
                'Accept':'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Authorization': 'Bearer ' + values.token,
               },
        cache: 'no-cache',
        body: formData 
      })
      .then((response) => {
        if(response.ok) {
          alertMSG(2)
        }
      
      })
      .catch((e) => {  console.log(e) })
    }
 /**
     * 함수명 : onEditCard
     * 함수작성자 : 이은정
     * 기능 : 기존 콜백 함수 수정하는 함수, 기존에 첨부된 이미지 파일 주소를 읽어와야함
     */
    const onEditCard=()=>{

        setIsUploading(true)
        var formData1 = new FormData();
        var cardidchk = 1;
        cardidchk = cardId;
        formData1.append('card_id',cardId);
        formData1.append('content', value);
        for(let i=0; i<compressedFile.length; i++) {
          formData1.append('file',compressedFile[i])
        }
          formData1.append('imgPath',attached)
        
       fetch(config.URL_ADDRESS+config.UPDATE_CARD+values.user, { 
        method:'PATCH',
        mode:'cors',
        
        headers: {
           'Accept': 'application/json',
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Credentials': true,
           'Authorization': 'Bearer ' + values.token,
        },
        body: formData1,
      })
      .then(response=> {
        if(response.status===200) {
          alertMSG(1)
          return response.text()
        } else {
          alert('업로드실패 하였습니다. ');
        }
        
        
       })
      
       .catch((err)=>{
        console.log(err)
      })
     
    }
    // 함수는 호출되기전에 정의할 수 있도록 (자바스크립트라서 에러안남)
    /**
     * 함수명 : alertMSG
     * 함수작성자 : 이은정
     * 기능 : 콜백 문자 수정 및 추가시에 사용자에게 알려주는 popup 메시지를 설정 및 띄우는 함수
     * @param {number} num 1:콜백문자수정 2:콜백문자추가 안내 메시지 설정 
     */
     function alertMSG(num) {
      
      if(num===1) {
        
        setOpenAlert(!openAlert)
        setAlertDetail({
          title:"콜백 문자 수정",
          message:"콜백 문자 수정이 완료되었습니다.",
          close:false,
          lists:[],
          confirm:false,
          onClick:null,
          color:theme.btnColor,
      })
      }
      if(num===2) {
        setOpenAlert(!openAlert)
        setAlertDetail({
          title:"콜백 문자 추가",
          message:"콜백 문자 작성이 완료되었습니다.",
          close:false,
          lists:[],
          confirm:false,
          onClick:null,
          color:theme.btnColor,
      })
      }
    }
    const loadPage=(u)=>{
      let url = u;
      window.location.replace(url)

    }
    useEffect(()=>{
      if(alertDetail.title==="콜백 문자 수정" ||alertDetail.title==="콜백 문자 추가" ) {
        setTimeout(()=>{
          loadPage('/')
        },2000)
      }
    },[alertDetail])
    /**
     * 함수명 : onCount
     * 함수작성자 : 이은정
     * 기능 : 콜백 카드 본문 작성 글자수 카운팅하고 1000자 이상 작성시 제한하는 함수
     * @param {object} e event 객체 
     */
    const onCount=e=>{
      let maxCount = 1000;
        if(e.target.value.length>maxCount) {
          alert('1000자까지만 입력 가능합니다.')
        }
        var temp = e.target.value.substr(0,maxCount);
        setValue(temp)
        setStrLength(temp.length)
        setCurData({
          ...curData,
          content:temp
        })
    }
    /**
     * 함수명 : handleFileOnChange
     * 함수작성자 : 이은정
     * 기능 : 사용자가 콜백 카드에 이미지 추가할 시 문자로 발송 가능하도록 용량을 조절하고 url 값으로 이미지 경로 저장하여 s3에 전송할 수 있도록 가공하는 함수
     * @param {obejct} e event 객체 
     * @param {number} num 1: 콜백카드생성시 2:콜백카드수정시 이미지처리 
     */
    const handleFileOnChange = async (e,num) => {
        e.preventDefault();
        let card_img = e.target.files;
        let temp_img = imgList;
        let temp_url = imgUrlList;
        let temp_compressed = [...compressedFile];
        const options = { 
          maxSizeMB: 2, 
        }
        const options2 = { 
          //maxSizeMB: 2,
          maxWidthOrHeight: 300,
        }
        setIsUploading(true);
        // 콜백카드 생성
        if(num===1) {
             try {
              for(let i = 0; i < card_img.length; i++) {
                if(card_img.length===1) {
                  temp_compressed[compressedFile.length] = await imageCompression(card_img[i], options);
                }else {
                  temp_compressed[temp_compressed.length] = await imageCompression(card_img[i], options);
                }
                setCompressedFile(temp_compressed)
                const currentImageUrl = URL.createObjectURL(card_img[i]);
                temp_url.push(currentImageUrl);
              }
              if (temp_url.length > 5) {
                temp_compressed = temp_compressed.slice(0, 5);
                temp_url = temp_url.slice(0, 5);
                $(".background").addClass("show");
                setTimeout(() => {
                  $(".background").removeClass("show");
                }, 2000);
              }
              setImgList([temp_img])
              setImgUrlList(temp_url);
              setIsUploading(false);
            } catch (error) {
                console.log(error);
            }
        }
        // 콜백카드 수정
        else if(num===2) {
         try {
          for(let i = 0; i < card_img.length; i++) {
            if(card_img.length===1) {
              temp_compressed[compressedFile.length] = await imageCompression(card_img[i], options);
            }else {
              temp_compressed[temp_compressed.length] = await imageCompression(card_img[i], options);
            }
            const currentImageUrl = URL.createObjectURL(card_img[i]);
            temp_url.push(currentImageUrl);
            setCompressedFile(temp_compressed)
          }
          if (temp_url.length > 5) {
            temp_compressed = temp_compressed.slice(0, 5);
            temp_url = temp_url.slice(0, 5);
            $(".background").addClass("show");
            setTimeout(() => {
              $(".background").removeClass("show");
            }, 2000);
          }
          setImgList(compressedFile);
          setImgUrlList(temp_url);
          setIsUploading(false);
        } catch (error) {
            console.log(error);
        }
        }
      }
      /**
       * 함수명 : handleDeleteImage
       * 작성자 : 이은정
       * 기능 : 첨부한 이미지 삭제시 화면,서버에서 해당 이미지 삭제
       * @param {number} id indext
       */
      const handleDeleteImage = (id) => {
        if(cardId===-1) {
          setImgUrlList(imgUrlList.filter((_, index) => index !== id));
          setImgList(imgList.filter((_,index)=>index!==id))
          setCompressedFile(compressedFile.filter((_, index) => index !== id))
        }
        else {
          let copy = imgUrlList.filter((_, index) => index !== id)
          setImgUrlList(copy);
          setAttached(copy.toString())
        }
      };
    return (
      <Fade clear>
        <MsgStyle>
        <div className="create-callback">
            <Top theme={theme} logo={false} icon={false} mypage={false} title="콜백작성" back={true} />
            <div className="content" style={{"backgroundColor":theme.bgColor}}>
                <div className="w-content">
                <form method={method.way} id={method.id} encType="multipart/form-data">
                <div>
                <div className="cb-title">상세내용</div>
                <div className="cb-desc">
                   {cardId === -1
                   ?
                   <textarea maxLength={999} type="textarea" placeholder={
                    `자유롭게 나만의 프로필을 만들어주세요. \n상세하게 내용을 적을수록 프로필에 도움이 됩니다.\n\n프로필은 최소 10자, 최대 1000자 이하까지\n작성 가능합니다.
                    `}
                    onChange={(e)=>onCount(e)}>
                    </textarea>
                    :
                    <textarea maxLength={999} type="textarea" placeholder={
                    `자유롭게 나만의 프로필을 만들어주세요. \n상세하게 내용을 적을수록 프로필에 도움이 됩니다.\n\n프로필은 최소 10자, 최대 1000자 이하까지\n작성 가능합니다.
                    `} 
                    value={curData?.content}
                    onChange={(e)=>onCount(e)}></textarea>
                    }
                    <div>{strLength !== 0
                    ?
                    <p style={{"color":theme.btnColor}}>{strLength}</p>
                    :
                    <p style={{"color":" #8C969F"}}>{strLength}</p>
                    }/1000</div>
                </div>
                </div>
                <div className="cb-img">
                    <div className="img-title"><p style={{"color":" #8C969F"}}>사진 등록</p>
                    {imgUrlList.length !== 0 ?
                    <>
                    <p style={{"color":theme.btnColor, "paddingLeft":"5px"}}>{imgUrlList.length}</p>
                    </>
                    :
                    <>
                    <p style={{"color":"#8C969F", "paddingLeft":"5px"}}>{imgUrlList.length}</p>
                    </>
                    }
                    /5</div>
                    <div className="img-input">
                        {
                          cardId === -1
                          ?
                          <input type="file" accept="image/jpg,image/png,image/jpeg" multiple="multiple" className="upload_img" id="upload_btn" style={{"display":"none"}} 
                        onChange={(e)=>handleFileOnChange(e,1)}></input>
                        :
                        <input type="file" accept="image/jpg,image/png,image/jpeg" multiple="multiple" className="upload_img" id="upload_btn" style={{"display":"none"}} 
                        onChange={(e)=>handleFileOnChange(e,2)}></input>
                        }
                        <label htmlFor="upload_btn"><div><img src={Camera} alt="add_photo"/><p>사진추가</p></div></label>

                        {imgUrlList.map((image, id, index) => (
                            image !== null
                            ?
                            <div className="img-preview" key={id}>
                            <div className='img'><img src={image} alt={`${image}-${id}`} /></div>
                            <img src={theme.cancel} onClick={() => handleDeleteImage(id)} alt="preview_img"/>
                            </div>
                            :
                            null
                        ))}
                    {
                      <Popup>
                    <div className='background'>
                        <div className='window'>
                            <div className='popup'>
                                <div className='msg-pop'>
                                    <p className='msg' style={{opacity:"1"}}>사진은 5개까지 첨부 가능합니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Popup>
                    }

                    </div>    
                    <ul>
                        <li>용량은 각 2MB 이하, jpg,png 파일만 첨부 가능합니다.</li>
                        <li>첨부파일은 최대 5개까지 등록 가능힙니다.</li>
                        <li>이미지에 개인정보(주민번호 등)가 포함되지 않도록 주의해주세요.</li>
                    </ul>
                </div>
                <div className="btn-wrapper">
                  <input form="add" type="button" id="com-btn" style={{"display":"none"}} />
                  <label htmlFor="com-btn">
                    {
                    strLength > 9 && cardId === -1
                    ?
                    <Button txt="작성완료" color={theme.btnColor} inactive={false} onSubmit={onAddCard}/>
                    : 
                    (strLength > 9 && cardId !== -1
                    ?
                    <Button txt="작성완료" color={theme.btnColor} inactive={false} onSubmit={onEditCard}/>
                    :
                    <Button txt="작성완료" color={theme.inactive} inactive={true}/>)
                    } 
                  </label>
                </div>
                </form>
                </div>
                {
                  isUploading
                  ?
                  <Loader isCenter={true} color={theme.btnColor}/>
                  :
                  null
                }
            </div>
            {openAlert
            ?
            <Alert title={alertDetail.title} message={alertDetail.message} close={alertDetail.close} lists={alertDetail.lists} confirm={alertDetail.confirm} onClick={alertDetail.onClick} color={alertDetail.color} onClose={setOpenAlert}/>
            :
            null
          }
        </div>
        </MsgStyle>
        </Fade>
    )
}
const MsgStyle = styled.div`
.create-callback .img-title {
  display: flex;  align-items: center; color: var(--color-light-font);
}
.create-callback > .content {
  background-color: var(--color-blue-bg);
}
.create-callback .cb-title {
  padding:15px 0;
}
.create-callback .cb-desc {
  background-color: white; border-radius: 16px; padding: 15px; height: 186px; 
}
.create-callback .cb-desc textarea{
  width: 100%; border: none; color: var(--color-dark-font);  height: 90%; font-weight: 400;
  font-size: 14px; margin-bottom:6px;
  line-height: 22px; resize: none;
  
  letter-spacing: -0.05em;
}
.create-callback .cb-desc textarea::placeholder {
  color: var(--color-light-font);
}
.create-callback .cb-desc textarea:focus {
  outline: none;
}
.create-callback .cb-desc p {
  margin: 0; 
}
.create-callback .cb-desc div{ 
  display: flex; width: 30px; margin: 0; font-size: 12px; line-height: 22px; position: relative; bottom: 8px; left: 85%; color: var(--color-light-font);
  padding-bottom:1em;
}
.img-input label > div,
.img-input .img-preview {
  width: 72px; height: 72px;  background: #FFFFFF;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.07);
  border-radius: 12px; padding-top: 10px; text-align: center; color: var(--color-light-font);
}
.img-input .img-preview {
  padding-top: 0; margin-left: 8px; min-width: 72px;
}
.img-input .img-preview .img{
  width: 100%; height: 100%;  
}
.img-input .img-preview .img img {
  width: 100%; height: 100%; border-radius: 12px;
  object-fit: cover;
} 
.img-preview > img{
  position: relative;
  top: -80px;
  right: -27px;
  width: 18px;
}
.img-input label > div p {
  margin: 0; font-weight: 400; font-size: 12px; line-height: 22px; letter-spacing: -0.05em;
}
.cb-img ul{
  padding-left: 5%;
}
.cb-img ul li{
  font-weight: 400; font-size: 11px; line-height: 20px; letter-spacing: -0.05em;  color: var(--color-light-icon); 
}
.create-callback .img-input {
  height:90px; display: flex; overflow-x: scroll; overflow-y: hidden; align-items: center;
}
.create-callback .btn-wrapper div,
.none-content .btn-box {
  line-height: 40px;
    height: 42px; color: white; border-radius: 8px; text-align: center; margin-left: auto; margin-right: auto;     margin-top: 15px;
    /* width: 90%; */
}
/* pick send msg list */
.create-callback .receivers {
    height: 100%; z-index: 100;
}
.create-callback .w-rec {
    height: 100%; 
}
.create-callback .w-rec .content {
    width: 90%; margin-left: auto; margin-right: auto; background-color: white;
}
.create-callback .rec-title p:first-child{
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 18px;
  align-items: center;
  letter-spacing: -0.05em;margin: 0;
}
.create-callback .rec-title p:last-child{
  font-weight: 400; font-size: 12px; line-height: 20px; letter-spacing: -0.05em; color: var(--color-light-icon); margin: 10px 0 8px 0;
}
`
const Popup = styled.div`
/* 파일 갯수 초과시 뜨는 팝업 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  /* 숨기기 */
  z-index: -1;
  opacity: 0;
}
.show {
  opacity: 1;
  z-index: 1000;
}
.window {
  position: relative;
  width: 100%;
  height: 100%;
}
 .popup {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #ffffff;
  transform: translate(-50%, -50%);
}
.show .popup {
  transform: translate(-50%, -50%);
  transition: all .5s;
}
.msg-pop {
  width: 220px; height: 70px; transition: all ease 2s;
  background: #79c3e0; text-align: center; opacity: 0.7;
  display: flex; align-items: center; justify-content: center;
}
.msg {
  margin: 0; font-size: 12px;
}

`