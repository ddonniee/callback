import React, {useEffect, useState} from "react";
import { Fade } from "react-reveal";
import styled from "styled-components";
import Close from '../public/svg/CloseIcon.svg'
export default function Alert(props) {
    const {title, message, close, lists ,confirm, onClick, color, onClose} = props;
    const [isBigAlert, setIsBigAlert] = useState(false);
    useEffect(()=>{
        if(title==="이메일 인증을 해야하는 이유") {
            setIsBigAlert(true)
        }
    },[title])
    return (
        <Fade clear>
            <AlertStyle color={color} height={isBigAlert}>
            <div className="alert_background">
                <div className="alert_window">
                <div className="w-alert">
                    <div className="t-alert">
                        <p className="alert-title">{title}</p>
                        {
                        close
                        ?
                        <img src={Close} onClick={(e)=>onClose(false)} alt="close_alert"/>
                        :
                        null}
                    </div>
                    <div className="content">
                        {
                            lists.length!==0
                            ?
                            lists.map((list,index)=>{
                                return(
                                    <ul className="reasons">
                                        <li key={`reason`+index}>
                                            <div><img src={list.icon} alt="list-icon"/></div>
                                            <div><p>{list.title}</p><p>{list.desc}</p></div>
                                        </li>
                                    </ul>
                                )
                            })
                            :
                            <p>{message}</p>
                        }
                        {
                            confirm
                            ?
                            <div className="btn-confirm" >
                                <p className="confirmed">확인</p>
                                <p onClick={onClose(false)}>취소</p>
                            </div>
                            :
                            null
                        }
                    </div>
                </div>
                </div>
            </div>
            </AlertStyle>
        </Fade>
    )
}

const AlertStyle=styled.div `
    .alert_background {
        position: fixed; top: 0; left: 0;  width: 100%; height: 100vh; background-color: rgba(0, 0, 0, 0.3); box-sizing:border-box; z-index: 1000;
    }
    .alert_window {
        position: relative; width: 100%; height: 100%;
    }
    .w-alert {
        background: white; border-radius: 16px;  position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff; 
        box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3); width:90%; min-height: 100px; max-height: 241px; height: ${props=>props.height===false? '145px':'241px'}
    }
    .t-alert {
        display: flex; justify-content:space-between; 
        padding: 1em 1em 0em 1em;
    }
    .t-alert > p {
        font-weight: 700; font-size: 18px; line-height: 30px; letter-spacing: -0.05em; color: #35394A; 
    }
    .alert_background .content > p {
        font-weight: 400; font-size: 15px; line-height: 24px; letter-spacing: -0.05em; color: #5D6067; padding-left: 1em;
        margin:0; 
    }
    .alert_background .content  ul {
        list-style:none; padding:0 1em;  
    }
    .alert_background .content > ul > li {
        display: flex;  align-items:center; 
    }
    .alert_background .content > ul > li > div:first-child {
        padding-right:1em; 
    }
    .alert_background .content > ul > li > div > p:first-child {
        font-weight: 500; font-size: 13px; line-height: 21px; letter-spacing: -0.05em; color: #5D6067; margin:0; 
    }
    .alert_background .content > ul > li > div > p:nth-child(2) {
        font-weight: 400; font-size: 13px; line-height: 21px; letter-spacing: -0.05em; color: #8C969F; margin:0;
    }
    .btn-confirm {
        display: flex; flex-direction: row-reverse; padding-right: 1em; 
    }
    .btn-confirm p {
        padding-left:1em; font-weight: 400; font-size: 15px; line-height: 24px; letter-spacing: -0.05em; color: #8C969F;
    }
    .confirmed {
        color: ${props=>props.color} 
    }
    .create-callback  .background1 {
        position: relative; top: 0; left: 0;  width: 100%; height: 10000vh; background-color: rgba(0, 0, 0, 0.3); box-sizing:border-box; z-index: 1000;
    }
`