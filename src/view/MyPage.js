/* eslint-disable */
import React, { useEffect, useState,useLayoutEffect,useContext } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-reveal";
import * as config from '../config'
import styled from "styled-components";
import imageCompression from 'browser-image-compression';
// components
import Top from "../component/Top";
import SettingModal from "../component/SettingModal";
import Loader from "../component/Loader";
import { AppContext,MemberContext } from "../App";
// svgs
import One from '../public/svg/planner.svg';
import Two from '../public/svg/clipboard.svg';
import Three from '../public/svg/calling.svg';
import Four from '../public/svg/lock.svg';
import Five from '../public/svg/people-.svg';
import Oner from '../public/svg/planner_red.svg';
import Threer from '../public/svg/calling_red.svg';
import Fiver from '../public/svg/people-red.svg';
import Arrow from '../public/svg/a-right.svg';
import Profile from '../public/svg/profile_img.svg';
import Edit from '../public/svg/edit_profile.svg';

export default function MyPage(prop) {
    
    const theme = prop.theme;
    const value = useContext(AppContext);
    const member = useContext(MemberContext);
    const [info, setInfo] = useState({});
    const [icons, setIcons] = useState([])
    const [profileFile, setProfileFile] = useState([])
    const [isChangeProfile, setIsChangeProfile] = useState(false)
    const [compressedProfile, setCompressedProfile] = useState()
    const [isLoading, setIsLoading] = useState(false);

    useLayoutEffect(()=>{
        fetch(config.URL_ADDRESS+config.SERACH_USER+value.user, {
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization': 'Bearer ' + value.token,
              }
            })
            .then(res => {
              return res.json();
            })
            .then(data => {
                setInfo(data[0])
            })
            .catch=(e)=> {
                console.log(e)
            }
    },[])

    useEffect(()=>{
        theme.btnColor === '#3182F7'
        ?
        setIcons([One, Three, Five])
        :
        setIcons([Oner, Threer, Fiver])
    },[])


    useEffect(()=>{
        console.log(profileFile,'profileFile')

        var formData = new FormData();
      
        formData.append('user_id',value.user);
        formData.append('file',compressedProfile)
        fetch(config.URL_ADDRESS+config.UPDATE_PROFILE, {
        method: 'PATCH',
        mode:'cors',
        headers: {
                'Accept':'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Authorization': 'Bearer ' + value.token,
               },
        cache: 'no-cache',
        body: formData // body 부분에 폼데이터 변수를 할당
      })
      .then((response) => {

        if(response.ok) {
            setInfo({
                ...info,
                profile:URL.createObjectURL(profileFile)
            })
            
        }
       
      })
      .catch((e) => {
        console.log(e)
      })
       
    },[profileFile])

       /**
     * 함수명 : pressedimg
     * 함수작성자 : 이은정
     * 기능 : 이미지 파일 객체 전달시 용량을 2mb로 압축해주는 함수
     * @param { object } files // event 객체에서 받아온 files 
     */
        async function pressedimg (files){
            let pressedImg = []
            try {
                pressedImg = await imageCompression(files[0], {maxSizeMB: 2});
                setCompressedProfile(pressedImg)
            }catch (err) {
                console.log(err)
            }
        } 
    
    /**
     * 함수명 : onUpdateProfile
     * 함수작성자 : 이은정
     * 기능 : 프로필 사진 변경시 이미지 압축 및 로딩바 보여주는 함수
     * 
     * @param {object} e event 객체, input 값으로 업로드한 file을 받아와야됨 
     */
    const onUpdateProfile=async (e)=>{
        const uploadImg = e.target.files
        setIsLoading(true)
        setIsChangeProfile(false)
        await pressedimg(e.target.files)
        setIsLoading(false)
        setProfileFile(...uploadImg)
    }
    /**
     * 함수명 : onDeleteProfile
     * 함수작성자 : 이은정
     * 기능 : 사용자 프로필 사진 초기화해주는 함수
     * @param {object} e event객체 
     */
    const onDeleteProfile=(e)=>{
        const data = {
            user_id : value.user,
        }
            fetch(config.URL_ADDRESS+config.DELETE_PROFILE, {
            method:"PATCH",
            mode:'cors',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + value.token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
               },
            body:JSON.stringify(data)
        })
        .then(res=>{
            if(res.ok) {
                setInfo({                   // 어떤 값 셋팅하는지 주석 추가하기
                    ...info,                // 계산한 프로세스는 주석에 달지 않기 
                    profile:null            // => 요구사항이 바뀌었을때 혼동을 줄 수 있음
                })
                setIsChangeProfile(false)
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return (
        <Fade clear>
        <MyPageStyle color={theme.btnColor}>
        <div className="w-setting">
            <Top theme={null} logo={false} icon={false} mypage={false} title="마이페이지" back={true} bgColor={theme.bgColor} />
            <div className="content" style={{"backgroundColor":theme.bgColor}}>
                <div className="w-content">
                    <div className="t-content">
                        <div className="t-user">
                            <div className="user">
                               <div>
                               {
                                   info.profile !== null
                                   ?
                                   <img src={info.profile} />
                                   :
                                   <img src={Profile}/> 
                               }
                               </div>
                                <input className="profile_img" id="e-profile" onClick={(e)=>setIsChangeProfile(true)}></input>
                                <label htmlFor="e-profile">
                                    <img src={Edit} />
                                </label>
                            </div>
                            <p>{info.email}</p>
                            {/* <p>email joso</p> */}
                            <div className="auth-info">
                            {/* {info[0].email === null */}
                            {info.email=== null
                            ?
                            <>
                            <div className="no-email-auth">
                                <p>이메일 인증이 필요한 계정입니다.</p>
                                <Link to="/account"><p>이메일 인증</p></Link>
                            </div>
                            </>
                            :
                            null
                            }
                            
                            <div className="t-expire">이용기간이
                            {member.leftDays <= 0
                            ?
                            <p>만료되었습니다.</p>
                            :
                            <p><span style={{"color":theme.btnColor}}>{member.leftDays}</span> 일 남았습니다.</p>
                            }
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="m-content">
                        <ul className="m-list">
                            <li className="m-item">
                                <Link to="/payment">
                                    <img className="m-img" src={Two}></img>
                                    <p className="m-title">결제내역</p> 
                                </Link>
                            </li>
                            <li className="m-item">
                                <Link to="/log">
                                    <img className="m-img" src={icons[1]}></img>
                                    <p className="m-title">콜백기록</p>
                                 </Link>
                            </li>
                            <li className="m-item">
                                <Link to="/policy">
                                    <img className="m-img" src={Four}></img>
                                    <p className="m-title">개인정보보호</p>
                                </Link>
                            </li>
                            <li className="m-item">
                                <Link to="/terms">
                                    <img className="m-img" src={icons[2]}></img>
                                    <p className="m-title">이용약관</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="b-content" style={{"backgroundColor":theme.btnBg}}>
                            <div className="b-item">
                                <div><img className="b-img" src={icons[0]}></img></div>
                                <p className="b-desc">결제창으로 바로 이동! </p>
                                <p className="b-title">콜백 서비스연장</p>
                                <Link to="/payment"><img src={Arrow} alt="payment_link"></img></Link>
                            </div>
                    </div>
                    {
                    info.email !== null
                    ?
                    <div className="withdrawal">
                        <Link to="/account">회원탈퇴</Link>
                        <img src={Arrow}></img>
                    </div>
                    :
                    null
                    }
                </div>
            </div>
        </div>
        {
            isChangeProfile
            ?
            <SettingModal title="프로필 변경" color={theme.btnColor} onClick={setIsChangeProfile} isDuration={false} onChange={onUpdateProfile} onDelete={onDeleteProfile}/>
            :
            null
        }
        {
            isLoading
            ?
            <Loader isCenter={true} color={theme.btnColor} />
            :
            null
        }                        
        </MyPageStyle>
        </Fade>
    )
}
const MyPageStyle = styled.div `
.w-setting{
}
.w-setting .no-email-auth {
    display: flex; align-items: center; justify-content: center;
}
.w-setting .no-email-auth p{
    font-weight: 400; font-size: 12px;  letter-spacing: -0.05em; color: #8C969F; 

}
.w-setting .no-email-auth a {
    text-decoration:none; padding-left:5px;
}
.w-setting .no-email-auth a p{
    font-weight: 00; font-size: 12px;  letter-spacing: -0.05em; color: ${prop=>prop.color}; 
}
.m-item a{
    color:#5D6067;
}
.w-setting .w-content {
    width: 100%; position: relative; top: 68px; border-top-left-radius: 50px;  border-top-right-radius: 50px; padding: 30px;
    background-color: #ffffff; box-shadow: 0px 0px 10px #e8e8e8;  height: calc(100% - 124px);
}
.w-setting .w-content > div:nth-child(-n+2) {
    height: 15%;
}
.w-setting .t-content{
    text-align: center;  top: -14px; width: 100%;  
}
.w-setting{
    height: 100%;
}
.w-setting .profile_img {
   display:none;
 }
.w-setting .t-user .user{
    position: absolute;
    top: -36px;
    left: 39%;
}
.w-setting .t-user .user > div > img {
    width: 100%; height: 100%; border-radius: 50%; margin: 1px; 
}
.w-setting .t-user > p{
    font-weight: 500; font-size: 14px; line-height: 20px; text-align: center; color: #4C5866;
}
.w-setting .w-setting .t-user{
    border: 1px solid red;
}
.w-setting .withdrawal {
    display: flex; float: right; top: 30vh; position: relative; 
}
.w-setting .withdrawal a{
    font-style: normal; font-weight: 400; font-size: 12px; line-height: 24px;
    text-align: right; letter-spacing: -0.05em; color: #C6C6C6;  padding-right: 6px; text-decoration : none;
}
.w-setting .withdrawal img {
    margin-top: auto; margin-bottom: auto; 
}
@media only screen and (min-width : 830px) {
    .w-setting .t-user .user{
        position: absolute;
        top: -36px;
        left: 45%;
    }
    .w-setting .t-user .user > div > img {
        width: 100px; height: 100px; border-radius: 50%; margin: 1px;
    }
    .w-setting .t-user > p{
        font-weight: 600; font-size: 16px; line-height: 20px; text-align: center; color: #4C5866;margin-top: 30px;
    }
  
    .w-setting .withdrawal a{
        font-weight: 500; font-size: 16px; line-height: 24px; padding-right: 10px;
    }
    .w-setting .withdrawal img {
        width: 10px; padding-top: 3px;
    }

}
/* icon+font */

.w-setting .t-user .t-expire {
    display: flex; align-items: center;   justify-content: center;  font-weight: 700; font-size: 22px; line-height: 22px;
    text-align: center;  letter-spacing: -0.05em; 
}
.w-setting .t-user .t-expire p {
    padding: 0px 1px 0px 5px;
}
.w-setting .t-user .user > div {
    width: 70px; height: 70px; border-radius: 50%; background-color: #ffffff; margin-left: auto; margin-right: auto;
    display: flex; align-items: center; justify-content: center;
}
 .w-setting .t-user label{
    position: relative;
    bottom: 24px;
    right: -27px;
 }
 .m-content .m-list{
    list-style: none; padding: 0px; display: table; justify-content: space-between; text-align: center; align-items: center; width: 100%; margin: 0;
}
.m-content .m-list p {
    margin: 0;font-size: 14px;
}
.m-content .m-list a{
    text-decoration: none;
}
.m-content .m-list li {
    height: 60px; min-height: 60px; box-sizing: border-box;  display:table-cell; text-align:center; vertical-align:middle; width: 25%; padding: 0 2px;
}
.m-content .m-list li:not(:last-child) {
    border-right: 1px solid #EFEFEF; 
}
.m-content .m-list li img {
    padding-top: 2px; 
}
.m-content .m-list li p {
    letter-spacing: -0.05em; font-weight: 500;
    font-size: 13px;
    line-height: 24px; 
}
.m-content .m-list li:nth-child(2) img {
    margin-top: 2px; padding-left: 10px;
}
.m-content .m-list li:nth-child(2) p {
    margin-top: 2px;
}

@media only screen and (max-width : 380px)  {
    .m-content .m-list li p {
        letter-spacing: -0.05em; font-weight: 500;
        font-size: 12px;
        line-height: 24px; 
    }
}

@media only screen and (min-width : 830px) {
    .m-content .m-list {
        justify-content: space-evenly;
    }
    .m-content .m-list li {
        width: 25%;
    }
    .m-content .m-list p {
         font-size: 16px;
    }
    .m-content .m-list .m-item {
        align-items: center; 
    }
    .m-content .m-list .m-item img {
        width: 40px;
    }
    
}

.b-content{
    margin-top: 45px; border-radius: 12px;
}
.b-content .b-item{
    display: flex; padding: 10px; justify-content: center; border-radius: 12px; box-shadow: 0px 0px 10px #e8e8e8;
    align-items: center; justify-content: space-evenly;
}
.b-content .b-item >div:first-child{
    width: 42px; height: 42px; border-radius: 50%; background: white; text-align: center;box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
}
.b-content .b-item p:nth-child(2){
    font-weight: 400; font-size: 12px; line-height: 22px; letter-spacing: -0.05em; color: #888888; position: relative; left: -2%;
    padding-top: 2px;
}
.b-content .b-item p:nth-child(3){
    font-weight: medium; font-size: 14px; line-height: 0px; letter-spacing: -0.05em; color: #4C5866;  position: relative; left: -4%; top: -4%;
}
.b-content .b-item .b-img{
    vertical-align: middle; position: relative; top:15%;
}

@media only screen and (max-width : 380px) {
    .b-content .b-item > div{
        position:relative; left:-5px;
    }
    .b-content .b-item .b-img {
         margin-top: 6px; left:-5px;
    }
    .b-content .b-item p:nth-child(2){
        padding-top: 0px;
    }
    .b-content .b-item p:nth-child(3){
        left: -3%;
    }
    }
@media only screen and (min-width : 830px) {
    .b-content .b-item >div:first-child{
        width: 50px; height: 50px; border-radius: 50%; background: white; text-align: center ;box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1); position: relative; left: -30px;
    }
    .b-content .b-item p:nth-child(2){
        font-weight: 500; font-size: 18px; line-height: 22px; letter-spacing: -0.05em; color: #888888; position: relative; left: 70px;
    }
    .b-content .b-item p:nth-child(3){
        font-weight: 550; font-size: 20px; line-height: 20px; letter-spacing: -0.05em; color: #4C5866; position: relative; left: 100px;
    }
    .b-content .b-item a img {
        width: 10px; position: relative; left: 40px; padding-top: 7px;
    }
    .b-content .b-item .b-img{
        padding-top: 10px; 
    }
}

`