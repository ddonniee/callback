import React, { useState, useContext, useLayoutEffect} from "react";
import styled from "styled-components";
import { Fade } from "react-reveal";
import { Link } from "react-router-dom";
import Top from "../component/Top";
import { MemberContext } from "../App";

import Symbol1 from '../public/svg/1symbol.svg';
import Symbol6 from '../public/svg/6symbol.svg';
import Symbol12 from '../public/svg/12symbol.svg';

import RSymbol1 from '../public/svg/1red.svg';
import RSymbol6 from '../public/svg/6red.svg';
import RSymbol12 from '../public/svg/12red.svg';

export default function Payment (props) {

    const member = useContext(MemberContext);
    const {theme,email} = props;
    const [icons, setIcons] = useState({
        aMonth : Symbol1,
        months : Symbol6,
        aYear : Symbol12
    })

    useLayoutEffect(()=>{
        if(theme.btnColor==="#3182F7") {
            setIcons({
                ...icons,
                aMonth : Symbol1,
                months : Symbol6,
                aYear : Symbol12 
            })
        }else if(theme.btnColor==='#E95548') {
            setIcons({
                ...icons,
                aMonth : RSymbol1,
                months : RSymbol6,
                aYear : RSymbol12 
            })
        }

    },[])

    return (
        <Fade>
            <PaymentStyle theme={theme}>
            <div className="background">
                <div className="w-payment">
                    <Top theme={theme} logo={false} icon={false} mypage={false} title="이용권구매" back={true}></Top>
                    <div className="content">
                        <div className="w-content">
                            <div className="content-title">
                                <p>이용기간이</p>
                                <div>
                                <p>{member.leftDays > 0 ? member.leftDays : null}</p><p>{member.leftDays > 0 ? "일 남았습니다.":"만료되었습니다."}</p>
                                </div>
                            </div>
                            {
                                email === null
                                ?
                                <div className="content-desc">
                                    <p>이메일 인증이 필요한 계정입니다.</p>
                                    <Link to="/account"><p>이메일 인증</p></Link>
                                </div>
                                :
                                null
                            }
                            <ul className="payments">
                                <Link to="/credit/1개월">
                                    <li className="payment_kind">
                                        <img src={icons.aMonth}></img>
                                        <div className="payment_type">
                                            <p>기본</p>
                                            <p>1개월 (30일)</p>
                                        </div>
                                        <div>
                                            <p></p>
                                            <p className="price">8,800원</p>
                                        </div>
                                        <input type="button" id="li-1" style={{display:"none"}}/>
                                        <label htmlFor="li-1" ><p>결제하기</p></label>
                                    </li>
                                </Link>
                                <Link to="/credit/6개월">
                                <li className="payment_kind">
                                <img src={icons.months}></img>
                                    <div className="payment_type">
                                        <p>10% 할인</p>
                                        <p>6개월 (180일)</p>
                                    </div>
                                    <div>
                                        <p>52,800원</p>
                                        <p className="price">47,520원</p>
                                    </div>
                                    <input type="button" id="li-2" style={{display:"none"}}/>
                                    <label htmlFor="li-2"><p>결제하기</p></label>
                                </li>
                                </Link>
                                <Link to="/credit/12개월">
                                <li className="payment_kind">
                                    <img src={icons.aYear}></img>
                                    <div className="payment_type">
                                        <p>20% 할인</p>
                                        <p>12개월 (365일)</p>
                                    </div>
                                    <div>
                                        <p>105,600원</p>
                                        <p className="price">84,480원</p>
                                    </div>
                                    <input type="button" id="li-3" style={{display:"none"}}/>
                                    <label htmlFor="li-3"><p>결제하기</p></label>
                                </li>
                                </Link>
                            </ul>

                            <ul className="payment-info">
                                <li>모든 결제는 부가세가 포함된 가격입니다.</li>
                                <li>결제한 서비스는 결제일 기준 당일 내에만 환불이 가능합니다.</li>
                                <li>{`환불은 오프라인으로 진행되며 
                                환불 담당 시간은 영업일 기준 오전 10시~오후6시까지 입니다.`}</li>
                                <li>환불상담연락처: 031-123-1234</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            </PaymentStyle>
        </Fade>
    )
}

const PaymentStyle = styled.div `
    a {
        text-decoration: none;
    }
    .content-title {
        font-weight: 700; font-size: 22px; line-height: 34px; letter-spacing: -0.05em; color: #35394A;  
    }
    .content-title div {
        display: flex; 
    }
    .content-title > p {
        margin-bottom:0;
    }
    .content-title div > p {
        margin:0;
    }
    .content-title > div > p:first-child {
        color: ${props=> props.theme.btnColor}; 
    }
    .content-desc {
        display: flex; margin:0;
    }
    .content-desc p{
        font-weight: 400; font-size: 12px; line-height: 20px; letter-spacing: -0.05em; color: #8C969F; 
   }
   .content-desc a {
    text-decoration: none;
   } 
    .content-desc a p {
        font-weight: 500; font-size: 12px; letter-spacing: -0.05em; color: ${props=>props.theme.btnColor}; text-decoration: none;
        padding-left: 10px; 
    }
    .payments  {
        list-style: none; padding:0; padding-top: 30px;
    }
    .payments .payment_kind {
        display: flex; justify-content: space-between; align-items: center; height:85px;
    }
    .payments li {
        border-bottom : 1px solid #F8F8F8;
    }
    .payments .payment_type {
        box-sizing: border-box; height : 100%; 
    }
    .payments div > p{
        margin:0;
    }
    .payments .payment_type > p:first-child  {
        font-weight: 700; font-size: 11px; line-height: 50px; letter-spacing: -0.06em; color: #8C969F;  
        margin-bottom:0; padding-bottom:0; height:50%;
    }
    .payments .payment_type > p:nth-child(2) {
         font-weight: 700; font-size: 16px; line-height: 20px; letter-spacing: -0.05em; color: #35394A; 
        }
    .payment_kind div:nth-child(3) p:first-child{
        font-weight: 400; font-size: 11px; line-height: 20px; letter-spacing: -0.05em; text-decoration-line: line-through; color: #C8C8C8;
    }
    .price {
        color: ${props=> props.theme.btnColor}; 
    }
    .payments label {
        margin-top:auto; margin-bottom:auto; width: 80px; height: 32px; left: 264px; top: 397px;
        background: #FFFFFF; border: 1px solid ${props=>props.theme.btnColor}; border-radius: 100px;  text-align: center; 
    }
    .payments label p{
         font-weight: 400; font-size: 12px; line-height: 5px; letter-spacing: -0.05em; color: ${props=>props.theme.btnColor};
    }
    .payment-info {
        padding: 20px; font-weight: 400; font-size: 12px; line-height: 18px; letter-spacing: -0.05em;  color: #8C969F;
        flex: none; order: 0; flex-grow: 0;
    }
    .payment-info li {
        margin-bottom: 5px;
    }

    @media only screen and (min-width : 830px) {
        .content-title {
             display: flex; 
        }
        .content-title div {
             align-items: center; margin-top: 17px;   
        }
        .content-title > p:first-child {
            padding-bottom : 5px; padding-right : 10px;
        }
        .payments .payment_kind div {
            display: flex; align-items : center;  
        }
        .payments li div:nth-child(3) p:first-child {
            padding-right : 10px;  
        }
        .payments li:first-child .payment_type {
            position : relative; left: -100px;  align-items: center;
        }
        .payments li:nth-child(2) .payment_type {
            position : relative; left: -74px;
        }
        .payments li:last-child .payment_type {
            position : relative; left: -70px;
        }
        .payments li .payment_type p:first-child {
            padding-right : 10px;  
        }
        .payments li:first-child div:nth-child(3){
            position : relative; left: -50px;  align-items: center;
        }
        .payments li:nth-child(2) div:nth-child(3) {
            position : relative; left: -24px;
        }
        .payments li:last-child div:nth-child(3) {
            position : relative; left: -20px;
        }
    }
`