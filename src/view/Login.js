/* eslint-disable */
import React, { useEffect, useState,useRef,useContext, useLayoutEffect } from "react";
import { Fade } from "react-reveal";
import styled from "styled-components";
// components
import Alert from "../component/Alert";
import Button from "../component/Button";
import Top from "../component/Top";
import { AppContext } from "../App";

import Service from '../public/svg/dollar.svg'
import Phone from '../public/svg/phone.svg'
import * as config from '../config'

export default function Login(props) {

    const value = useContext(AppContext);
    const theme = props.theme;
    const phone = props.phone
    const email_auth_reason = [
        {
            icon:Service,
            title:"유료 서비스 신청 시",
            desc:"필수로 이메일 인증을 해야 합니다."
        },
        {
            icon:Phone,
            title:"휴대폰 번호 변경 시",
            desc:"이메일인증으로 내 정보를 찾을 수 있습니다."
        }
    ]
    const [joinedEmail, setJoinedEmail] = useState([])
    const [email, setEmail]=useState(null)
    const [onAuth, setOnAuth] = useState(false)
    const [isActive, setIsActive] = useState(theme.btnColor);
    const [isNum, setIsNum] = useState(false)
    const [values, setValues] = useState({
        title : '',
        detail : '',
        desc : '',
        mode : 0 // 0:no setting 1:join 2:quit 3:confirm
    })

    // 인증 요청시 입력값 확인
    const [userEmail, setUserEmail] = useState(null);
    const [userValidNum, setUserValidNum] = useState();
    const [validation, setValidation] = useState({
        validNum:null,
        validTime:null,
        isValid:false
    })
    const [timer, setTimer] = useState()
    const [alert, setAlert] = useState(false)
    const [alertDetail, setAlertDetail] = useState({
        title:"",
        message:"",
        close:false,
        lists:[],
        confirm:false,
        onClick:null,
        color:theme.btnColor,
    });

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
                setEmail(data[0].email)
            })
    },[])

    useEffect(()=>{
        
        const countdown = setInterval(()=>{
            timer > 0
            ?
            setTimer(prev=>prev-1000)
            :
            null
        },1000)

        return()=>clearInterval(countdown)

    },[timer])
 
    useEffect(()=>{
        // 메일 형식 체크후 
        onRequestValidInfo();
    },[userEmail])

    useEffect(()=>{
        if(alertDetail.title==="이메일 인증") {
          setTimeout(()=>{
            loadPage('/')
          },2000)
        }
      },[alertDetail])

    const onCheckEmailForm=(e,num)=>{

        
        let temp = document.getElementById("email_input").value;
        temp = temp.toUpperCase();
        let arr_temp =temp.split("");
        let check_form = null;

        for( let i=0; i<arr_temp.length; i++) {
            if(arr_temp[i]==="@") {
                check_form = arr_temp[i];
            }
        }
       
    if(num===1) {
        setAlert(!alert)
        setAlertDetail({
            ...alertDetail,
            title:"이메일 인증을 해야하는 이유",
            message:"",
            close:true,
            lists:email_auth_reason,
            confirm:false,
            onClick:null,
        })
    }
    // 입력데이터가 있고 회원 탈퇴 진행할 때
    else {
        
        if(temp.length===0 ) {
            setAlert(!alert)
                setAlertDetail({
                    ...alertDetail,
                    title:"인증메일 오류알림",
                    message:"이메일 주소를 입력해주세요.",
                    close:true,
                    lists:[],
                    confirm:false,
                    onClick:null,
                })
            return false
        }

        else if(email!==null && check_form!==null && (email.toUpperCase()) !==temp) {   
            setAlert(!alert)        
            setAlertDetail({
                ...alertDetail,
                title:"인증메일 오류알림",
                message:"계정이 일치하지 않습니다.",
                close:true,
                lists:[],
                confirm:false,
                onClick:null,
            })
        return false
        }

        else if(temp.length!==0 && check_form===null) {
            setAlert(!alert)
            setAlertDetail({
                ...alertDetail,
                title:"인증메일 오류알림",
                message:"정확한 이메일 주소를 입력해주세요.",
                close:true,
                lists:[],
                confirm:false,
                onClick:null,
            })
            return false;
        }
        setUserEmail(temp);
    }
        return true;
}
    
    useEffect(()=>{
        fetch(config.URL_ADDRESS+config.EMAIL_CHECK, {
            mode:'cors',
            method:"GET",
            headers : {
                'Content-Type':'application/json',
                'Accept':'application / json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': 'Bearer ' + value.token,
            }
        })
        .then((res)=> {
            return res.json()
        })
        .then((data)=>
            setJoinedEmail(data)
        )
        .catch((err)=>{
            console.log(err)
        })
    },[])

    /**
     * 함수명 : onRequestValidInfo
     * 함수 작성자 : 이은정
     * 기능 : 이메일 인증시에 서버에서 인증번호 받아오는 함수로 서버에서 데이터 받아온 뒤 인증번호를 입력할 수 있는 input창과 인증시간을 확인할 수 있는 timer가 설정된다. 
     * @returns validNum, validTime 을 받아옴
     */
    const onRequestValidInfo=()=>{
        let isJoined = userEmail;
        if(email===null) {
            isJoined = onCheckJoined();
        }
        if(!isJoined) {
            return false
        }else {
            const myInfo = {
                email: email !==null ? email:isJoined,
                party: theme.btnColor ==='#E95548' ? 2 : 1, 
            }
            fetch(config.URL_ADDRESS+config.AUTH_MAIL, {
                mode:'cors',
                method:"POST",
                headers : {
                    'Content-Type':'application/json',
                    'Accept':'application / json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': 'Bearer ' + value.token,
                },
                body: JSON.stringify(myInfo) 
            })
            .then((res)=>{
                return res.json()
            })
            .then((data)=> {
                
            setValidation({
                validNum: data.resdata[0].chk_num,
                validTime: data.resdata[0].limit_time,
                isValid:true
            }),
                setTimer(300000),
                setOnAuth(true),
                setUserEmail(isJoined)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        
    }

    /**
     * 함수명 : setColor
     * 함수작성자 : 이은정
     * 기능 : 서버에서 인증번호 받아올 시 인증완료하는 버튼 활성화로 색상 적용
     * @param {boolean} isTrue 
     */
  
    function setColor(isTrue) {
        if(isTrue) {
            setIsActive(theme.default)
        }else {
            setIsActive(theme.btnColor)
        }
    }

    /**
     * 함수명 : onChangeNum 
     * 함수작성자 : 이은정
     * 기능 : 인증번호 입력하는 input 창 value 변화를 추적하고, 입력 데이터가 있을때만 버튼을 활성화 시킴
     * @param {obejct} e event 객체, target의 value로 입력값을 확인함
     */
    const onChangeNum=e=>{
       
        if(e.target.value.length===0) {
            setIsNum(false)
        }else {
            setIsNum(true)
        }
        setUserValidNum(e.target.value);
    }

    /**
     * 함수명 : onSubmitTask
     * 함수 작성자 : 이은정
     * 기능 : 이메일인증시 (가입,탈퇴) 인증번호, 인증시간 확인 후 가입 및 탈퇴를 진행하는 함수
     * @param {object} e event 객체, target의 id값을 받아오기위해 필요 (인증완료 => 인증번호, 인증시간 확인 /확인=>회원탈퇴 진행)
     * @returns 인증번호 불일치, 인증시간 만료시 해당 알림창 띄우기, 회원탈퇴 진행시 서버의 사용자 state 값 변경하여 탈퇴처리
     */
    const onSubmitTask=(e)=>{

        let currentTime = new Date().getTime();
        let testTime = new Date(validation.validTime).getTime();
        let btnTask = e.target.id;

        if(btnTask==='인증완료') {
            if(currentTime>testTime) {
                setAlertDetail({
                    ...alertDetail,
                    title:"인증시간 만료알림",
                    message:"인증번호 재 요청 후 진행해주세요.",
                    close:true,
                    lists:[],
                    confirm:false,
                    onClick:null,
                })
                setValidation({
                    validNum:null,
                    validTime:null,
                    isValid:false
                })
                setAlert(!alert)
                return false
            }
            if(currentTime<testTime) {
                if(userValidNum!=validation.validNum) {
                    setAlertDetail({
                        ...alertDetail,
                        title:"인증번호 오류알림",
                        message:"인증번호가 일치하지 않습니다.",
                        close:true,
                        lists:[],
                        confirm:false,
                        onClick:null,
                    })
                    setAlert(!alert)
                    return false
                }else {
                    email!==null
                    ?
                    setValues({
                        ...values,
                        title : '회원탈퇴',
                        detail : '회원탈퇴 안내',
                        desc:'그 동안 저희 서비스를 이용해주셔서 감사합니다.해당 계정에 연동되었던 서비스는 모두 중단됩니다.',
                        mode:3
                    })
                    :
                    joinCallback()
                }
                 
            }
        }
        if(btnTask==='확인') {
            leaveCallback()
        }
        
    }
    /** 
     * 함수명 : onCheckJoined 
     * 함수작성자 : 이은정
     *  기능 : 이메일인증시 서버에서 동일한 이메일 있는지 확인하는 함수, 카카오톡 인증 디자인 나오면 삭제 예정 로직
     * @returns true or false
     */
    const onCheckJoined=()=>{
        let temp = document.getElementById("email_input").value;
        
        for(let i=0; i<joinedEmail.length; i++) {
            if(joinedEmail[i].email===temp && email ===null) {
                setAlertDetail({
                    ...alertDetail,
                    title:"이메일 인증 오류",
                    message:"이미 가입이 완료된 메일입니다.",
                    close:true,
                    lists:[],
                    confirm:false,
                    onClick:null,
                })
                setAlert(true)
                return false
            }
         
        }
        return temp;
       
    }
    /**
     * 함수명 : joinCallback
     * 함수작성자 : 이은정
     * 기능 : 이메일 인증후 인증번호, 인증시간 유효할 시 사용자 정보에 email 정보 추가하는 함수
     */

    function joinCallback() {

        const data = {
            phone: phone,
            email: userEmail,
        }
        fetch(config.URL_ADDRESS+config.UPDAET_USER, {
            mode:'cors',
            method:"PATCH",
            headers : {
                'Content-Type':'application/json',
                'Accept':'application / json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': 'Bearer ' + value.token,
            },
            body: JSON.stringify(data) 
        })
        .then((res)=>{
            if(res.statusText==='OK') {
                alertMSG()
            }
            }
        )
        .catch((err)=>{
            console.log(err)
        })
    }
   
     /**
     * 함수명 : leaveCallback
     * 함수작성자 : 이은정
     * 기능 : 탈퇴시에 이메일 인증후 인증번호, 인증시간 유효할 시 사용자 state 변경하여 탈퇴처리, 앱종료
     */
    function leaveCallback() {
        const data = {
            user_id : value.user
        }
        fetch(config.URL_ADDRESS+config.DELETE_USER, {
            mode:'cors',
            method:"PATCH",
            headers : {
                'Content-Type':'application/json',
                'Accept':'application / json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': 'Bearer ' + value.token,
            },
            body: JSON.stringify(data) 
        })
        .then((res)=>{
            if(res.statusText==='OK') {
                getClose()
            }
            }
        )
        .catch((err)=>{
            console.log(err)
        })
    }

    /**
     * 함수명 : alertMSG
     * 함수작성자 : 이은정
     * 기능 : 이메일 인증 완료될 시 알림 popup창 및 해당 popup창에 입력될 안내 문구 설정
     */
    function alertMSG() {
        setAlert(!alert)
        setAlertDetail({
            ...alertDetail,
            title:"이메일 인증",
            message:"이메일 인증이 완료되었습니다.",
            close:false,
            lists:[],
            confirm:false,
            onClick:null,
        })
        
    }

   
      
    // email 값에 따라 이메일인증/회원탈퇴 페이지로 분기
    // email 은 url pathname으로 전달된
    useEffect(()=>{
        email !== null 
        ?
        setValues({
            ...values,
            title:"회원탈퇴",
            detail:"회원탈퇴 안내",
            desc:`회원탈퇴를 하시면\n해당 어플의 모든 기능을 사용하실 수 없으며,\n사용중인 서비스도 모두 폐기처리 됩니다.`,
            mode:2,            
        })
        :
        setValues({
            ...values,
            title:"이메일인증",
            detail:`원할한 서비스 이용을 위해\n이메일 인증을 해주세요.`,
            desc:'',
            mode:1,
        })
    },[email])

    useEffect(()=>{
        setColor(onAuth);
        if(onAuth===false) {
            setIsNum(false)
        }
    },[onAuth])

    function getClose() {
        return window.Android.CloseApp();
    }
    function loginWithKakao() {
        console.log('kakao login')
        return window.Android.goKakaoLogin();
    }
    function loadPage(u) {
        let url = u;
        window.location.replace(url)
      }

    console.log(validation.validNum,'validNum')
    return (
        <Fade clear>
            <LoginStyle color={theme.btnColor}>
            <div className="w-login">
                <Top theme={null} logo={false} mypage={false} title={values.title} back={true}/>
                <div className="content">
                    <div className="w-content">
                        <form>
                        <div className="t-content">
                            <p>{values.detail}</p>
                            {email !==null
                            ?
                            <>
                            <p>{values.desc}</p>
                            {values.mode !==3 ?<p className="sub-info">* 메일을 재인증하셔야 탈퇴처리됩니다.</p> : null }
                            </>
                            :
                            <p className="reason" onClick={(e)=>onCheckEmailForm(e,1)}>이메일 인증을 해야하는 이유</p>
                            }
                            
                        </div>
                        {
                            values.mode!==3 
                            ?
                            <div className="b-content">
                            <div className="title">이메일주소</div>
                            <div className="input-box">
                                <input type="email" placeholder="예: adpot@pospot.kr" id="email_input"></input>
                                <input type="button" style={{"display":"none"}} id="auth_btn" onClick={(e)=>onCheckEmailForm(e,2)}></input>
                                <label htmlFor="auth_btn"><div style={{"color":isActive, "borderColor":isActive}} >인증요청</div></label>
                            </div>
                            {/* <a id="kakao-login-btn" href="javascript:loginWithKakao()" > */}
                            <div id="kakao-login-btn" href="#" onClick={(e)=>loginWithKakao()}>
                                <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="222" alt="카카오 로그인 버튼" />
                            </div>
                            <p id="token-result"></p>

                            {onAuth ?
                            
                            <Fade clear>
                                
                                    <div className="input-box">
                                    <input type="number" placeholder="인증 번호 입력" onChange={(e)=>onChangeNum(e)}></input>
                                    <p style={{"color":theme.btnColor}}>{Math.floor(timer/60000)}분 {(timer%60000)/1000}초</p>
                                  
                                    <input type="button" style={{"display":"none"}} id="re-auth" onClick={()=>onRequestValidInfo()}></input>
                                    <label htmlFor="re-auth"><div>다시받기</div></label>
                                    </div>
                                   
                           
                            </Fade>
                            :
                            null
                            }
                        </div>
                        :
                        null
                        }
                            
                        {
                    isNum ?
                    <Fade clear>
                    <Button txt={values.mode !==3 ? "인증완료" : "확인"} id={values.mode !==3 ? "인증완료" : "확인"} color={theme.btnColor} onSubmit={(e)=>onSubmitTask(e)}/>
                    </Fade>
                    :
                    null 
                }
                </form>
                    </div>
                    
                </div>
               {alert
               ?
                <Alert title={alertDetail.title} message={alertDetail.message} close={alertDetail.close} lists={alertDetail.lists} confirm={alertDetail.confirm} onClick={alertDetail.onClick} color={alertDetail.color} onClose={setAlert}/>
                :
                null}
            </div>
            </LoginStyle>
        </Fade>
    )
}

const LoginStyle = styled.div `

/* 이메일인증 */
.w-login .t-content {
    padding: 20px 0;
}
.w-login .t-content p:first-child{
    font-family: 'Noto Sans'; font-style: normal; font-weight: 700; font-size: 1.2em; line-height: 34px; letter-spacing: -0.05em;
    color: var(--color-black); white-space:pre-wrap;
}
.w-login .t-content p:nth-child(2) {
    font-weight: 400; font-size: 15px; line-height: 22px; letter-spacing: -0.05em; white-space:pre-wrap;
}
.w-login .t-content .sub-info {
    font-weight: 500; font-size: 14px; line-height: 17px; letter-spacing: -0.06em;  color: ${props=>props.color};
}
.w-login .t-content .reason {
    font-style: normal; font-weight: 400; font-size: 12px; line-height: 22px; text-align: right;
    letter-spacing: -0.05em; text-decoration-line: underline; color: var(--color-light-icon); display: flex;  flex-direction: column;
}
.w-login .b-content input[type=email]::placeholder,
.w-login .b-content input[type=number]::placeholder {
    color: #C8C8C8;
}
.w-login .b-content input[type=email],
.w-login .b-content input[type=number] {
    color:  var(--color-black); border: none;
}
.w-login .b-content input[type=email]:focus,
.w-login .b-content input[type=number]:focus {
    outline: none; 
}
.w-login .b-content .title{
    font-style: normal; font-weight: 500; font-size: 13px; line-height: 24px; letter-spacing: -0.05em;  color: var(--color-black)
}
.w-login .b-content .input-box {
    display: flex; border-bottom: 1px solid #E8E8E8; justify-content: space-between; padding: 10px 0px; align-items: center; height: 49px; 
}
.w-login .b-content .input-box p{ 
    font-style: normal; font-weight: 400; font-size: 12px; line-height: 24px;
}
.w-login .b-content .input-box div {
    width: 67px; height: 28px; left: 277px; top: 294px; border: 1px solid #E8E8E8; border-radius: 100px;
    font-style: normal; font-weight: 400; font-size: 11px; line-height: 17px; letter-spacing: -0.05em; color: var(--color-light-icon);
    align-items: center; text-align: center;    padding-top: 4px;
}

.w-login .btn-wrapper {
    margin: 20px 0;
}

#kakao-login-btn {
    text-align: center; position: relative; top: 50px;
}
@media only screen and (min-width : 830px) {
    .w-login .t-content p:nth-child(2) {
        font-weight: 500; font-size: 17px;  
    }
    .w-login .t-content .sub-info {
        font-weight: 400; font-size: 15px; 
    }
    .w-login .b-content .title{
        font-weight: 600; font-size: 15px; 
    }
    .w-login .b-content .input-box p{ 
        font-weight: 500; font-size: 14px; position: relative; left: 200px;
    }
}
`