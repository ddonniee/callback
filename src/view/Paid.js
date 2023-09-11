import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fade } from "react-reveal";
import styled from "styled-components";

import Top from "../component/Top";
export default function Paid(props) {

    const theme = props;
    const [message, setMessage] = useState({
        title : '',
        desc : ''
    })
    let params = useParams();
    // params로 서버에서 내려주는 성공/실패 여부에 따라 화면에 안내하는 텍스트 설정
    useLayoutEffect(()=>{
        console.log(params.id)
        if(params.id===':success') {
            setMessage({
                ...message,
                title:'결제가 완료되었습니다.',
                desc:'잠시 후 메인화면으로 연결됩니다.'
            })
        }
        else if(params.id===':fail') {
            setMessage({
                ...message,
                title:'결제가 실패하였습니다.',
                desc:'다시 시도하여 주시기 바랍니다.'
            })
        }
    },[])
    useEffect(()=>{
        setTimeout(()=>{
            window.location.replace('/')
        },3000)
    },[message])

    return (

        <Fade clear>
            <Top theme={theme} logo={true} icon={true} mypage={false} title={false} back={false} />
            <STYLE>
                <div className="w-paid">
                    <div className="i-paid">
                        <div className="title">{message.title}</div>
                        <div className="desc">{message.desc}</div>
                    </div>
                </div>
            </STYLE>
        </Fade>
    )
}

const STYLE = styled.div `
    .w-paid {
        width: 100vw; height : 100vh; text-align: center; display: flex;
    }
    .i-paid {
        margin: auto; 
    }
    .title {
        font-family: 'Noto Sans KR'; font-style: normal; font-weight: 700;  font-size: 26px;
        margin-top : auto; margin-bottom: auto;
    }
    .desc{
        font-style: normal; font-weight: 400; font-size: 17px; line-height: 22px;
    }
`