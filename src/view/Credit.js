import React, { useLayoutEffect, useState,useContext } from "react";
import { Fade } from "react-reveal";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import * as config from '../config'
import $ from 'jquery';
// components
import Top from "../component/Top";
import Button from "../component/Button";
import { AppContext } from "../App";
// svg files
import Symbol1 from '../public/svg/1symbol.svg';
import Symbol6 from '../public/svg/6symbol.svg';
import Symbol12 from '../public/svg/12symbol.svg';
import RSymbol1 from '../public/svg/1red.svg';
import RSymbol6 from '../public/svg/6red.svg';
import RSymbol12 from '../public/svg/12red.svg';
import Check from '../public/svg/check.svg';
import RCheck from '../public/svg/check_red.svg';
import BCheck from '../public/svg/check_blue.svg';
import moment from "moment";

export default function Credit(props) {
    const value = useContext(AppContext);
    let params = useParams();
    let theme = props.theme;
    let email = props.email
    // 결제 상품별 아이콘과 정보기재
    const [service, setServise] = useState({
        icon : '',
        title : '',
        code : '',
        price : '',
        won : '',
        checked : '',
    })
    // 결제 요청시 필요한 데이터, 모두 필수임
    const [storeInfo, setStoreInfo] = useState({
        userId : '',
        email : '',
        service : '',
        mid : '',
        hash : '',
        apiKey: '',
        rUrl : '',
        uMethod: '',
        payGroup: '',
        paymethod: 'CC',
        buyItemnm: '',
        buyReqamt: '',
        buyItemcd: '',
        orderno : 'A'+moment().format('YYYYMMDDHHmmss')+value.user,
        orderdt : moment().format('YYYYMMDD'),
        ordertm : moment().format('HHmmss'),
    })
    /**
     * TODO: 결제테스트 완료후 1개월 상품금액 변경하기
     */
    useLayoutEffect(()=>{
        if(theme.btnColor==='#3182F7') {
            setServise({
                ...service,
                icon: params.id==='1개월'? Symbol1 : params.id==='6개월'? Symbol6 : Symbol12,
                title : params.id,
                code : params.id==='1개월'? 'one' : params.id==='6개월'? 'half' : 'dozen',
                price : params.id==='1개월'? '100' : params.id==='6개월'? '100' : '1000',
                won : params.id==='1개월'? '8,800' : params.id==='6개월'? '47,520' : '84,480',
                checked : BCheck
            })
        }else if(theme.btnColor==='#E95548'){
            setServise({
                ...service,
                icon: params.id==='1개월'? RSymbol1 : params.id==='6개월'? RSymbol6 : RSymbol12,
                title : params.id,
                code : params.id==='1개월'? 'one' : params.id==='6개월'? 'half' : 'dozen',
                price : params.id==='1개월'? '100' : params.id==='6개월'? '100' : '100',
                won : params.id==='1개월'? '8,800' : params.id==='6개월'? '47,520' : '84,480',
                checked : RCheck
            })
        }
    },[])
    useLayoutEffect(()=>{
        if(service.price !== '') {
            const request = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type':'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'reserved01' : value.user,
                    'reserved02' : service.code,
                    'email': email,
                    'orderno': storeInfo.orderno,
                    'orderdt': storeInfo.orderdt,
                    'ordertm': storeInfo.ordertm,
                    'buyReqamt':service.price,
                })
            }
            fetch(config.PAYMENT_KEY,request)
            .then((res)=>{
                return res.json()
            })
            .then((data)=>{
                setStoreInfo({ // 서버에서 hash, api key를 받아온 뒤 결제 요청에 필요한 데이터세팅
                    ...storeInfo,
                    mid: data.resdata.mid,
                    hash: data.resdata.hashValue,
                    apiKey: data.resdata.apiKey,
                    payGroup:storeInfo.paymethod ? 'CC' || 'VA' || 'BA' === 'GEP' : null,
                    paymethod: storeInfo.paymethod,
                    buyItemnm: service.title,
                    buyReqamt: service.price,
                    buyItemcd: service.title === '1개월' ? 'one' :  service.title === '6개월' ? 'half' : 'dozen',
                })
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    },[service])
    
    /**
     * 함수명 : goMobile
     * 작성자 : 이은정
     * 기능 : 사용자가 결제하기 클릭했을때 pg사 결제 팝업 오픈하는 함수, 모바일만 가능
     */
    const goMobile=()=> {
        var target = "";
		window.name = "myOpener";
		var win;
		var iLeft = (window.screen.width / 2) - (Number(550) / 2);
		var iTop = (window.screen.height / 2) - (Number(653) / 2);
        console.log(iLeft,iTop,'픽셀확인')
		var features = "menubar=no,toolbar=no,status=no,resizable=no,scrollbars=no,location=no";
		features += ",left=" + iLeft + ",top=" + iTop + ",width=" + 550 + ",height=" + 653;
		win = window.open("", "mobilePop", features);
		win.focus();
		target = "mobilePop"
        if(storeInfo.hash!=='') {
            document.form_payment.action = config.PAYMENT_URL + config.MOBILE_PAYMENT;
            // document.form_payment.target = target;
            document.form_payment.submit();
        }
        else {
            console.log('fail',storeInfo.hash)
        }
    }
    /**
     * 함수명 : changeChecked
     * 작성자 : 이은정
     * 기능 : 결제 수단 선택값 변경시에 state 값으로 update, 결제 모듈 접근시에 필수 조건
     * @param {object} e , target의 id를 받아와야해서 필수 전달
     */
    const changeChecked=(e)=>{
        setStoreInfo({
            ...storeInfo,
            paymethod: e.target.id
        })
    }
    return (
        <Fade clear>
         <STYLE color={theme.btnColor}>
         <div className="background">
                <div className="w-credit">
                <Top theme={theme} logo={false} icon={false} mypage={false} title="이용권구매" back={true}></Top>
                <div className="content">
                    <div className="w-content">
                        <div className="credit_kind">
                            <div><img src={service.icon} /></div>
                            <div>{service.title} {service.title==='1개월' ? '(30일)':service.title==='6개월' ? '(180일)' : '(365일)'}</div>
                        </div>
                        <form className="order_info">
                            <div><p>주문번호<span>{storeInfo.orderno}</span></p></div>
                                <div><p>결제금액<span>{service.won}</span><span>원</span></p></div>
                            <div>
                                <p>결제수단</p>
                                <ul>
                                    <li><input type="radio" name="method" value='신용카드' id="CC" onChange={(e)=>changeChecked(e)} defaultChecked ></input><label htmlFor="CC">신용카드<img src={ storeInfo.paymethod ==='CC' ? service.checked : Check}/></label></li>
                                    <li><input type="radio" name="method" value='계좌이체' id="BA" onChange={(e)=>changeChecked(e)}></input><label htmlFor="BA">계좌이체<img src={ storeInfo.paymethod ==='BA' ? service.checked : Check} /></label></li>
                                    <li><input type="radio" name="method" value='가상결제' id="VA" onChange={(e)=>changeChecked(e)}></input><label htmlFor="VA">가상결제<img src={ storeInfo.paymethod ==='VA' ? service.checked : Check} /></label></li>
                                    {/* <li><input type="radio" name="method" value='간편결제' id="EP" onChange={(e)=>changeChecked(e)}></input><label htmlFor="EP">간편결제<img src={ method==='EP' ? service.checked : Check} /></label></li> */}
                                </ul>
                            </div>
                        </form>
                        <Button txt="결제하기" color={theme.btnColor} onSubmit={goMobile}/>
                    </div>
                </div>
                </div>
            </div>
            <div hidden>
            <form id="form_payment" name="form_payment" method="post" onSubmit={goMobile}>
                    <div>승인요청 정보</div>
                    <table id="reqTable">
                        <tr >
                            <td className="rtable_title">01. 상점 ID</td>
                            <td><input type="text" id="mid" name="mid" readOnly value={storeInfo.mid} /></td>
                        </tr>
                        <tr > 
                            <td className="rtable_title">02. return URL</td>	
                            <td><input type="text" id="rUrl" name="rUrl" readOnly value={config.RETURN_PAYMENT} /></td>
                        </tr>
                        <tr >
                            <td className="rtable_title">03. return Method</td>
                            <td><input type="text" id="rMethod" name="rMethod" readOnly value="POST" /></td>
                        </tr>
                        <tr>
                            <td className="rtable_title">결제수단</td>
                            <td><input type="text" id="payType" name="payType" readOnly value={storeInfo.paymethod} /></td>
                        </tr>
                        <tr>
                            <td className="rtable_title">상품명</td>
                            <td><input type="text" id="buyItemnm" name="buyItemnm" readOnly value={storeInfo.buyItemnm} /></td>
                        </tr>
                        <tr>
                            <td className="rtable_title">상품가격</td>
                            <td><input type="text" id="buyReqamt" name="buyReqamt" readOnly value={storeInfo.buyReqamt} /></td>
                        </tr>
                        <tr >
                            <td className="rtable_title">07. 상품코드</td>
                            <td><input type="text" id="buyItemcd" name="buyItemcd" readOnly value={storeInfo.buyItemcd} /></td>
                        </tr>
                        <tr >
                            <td className="rtable_title">08. 구매자 ID</td>
                            <td><input type="text" id="buyerid" name="buyerid" readOnly value={value.user} /></td>
                        </tr>
                        
                        <tr >
                            <td className="rtable_title">09. 구매자명</td>
                            <td><input type="text" id="buyernm" name="buyernm" readOnly value="홍길동" /></td>
                        </tr>
                        <tr>
                            <td className="rtable_title">구매자 E-mail</td>
                            <td><input type="text" id="buyerEmail" name="buyerEmail" readOnly value={email} /></td>
                        </tr>
                        <tr>
                            <td className="rtable_title">주문번호</td>
                            <td><input type="text" id="orderno" name="orderno" readOnly value={storeInfo.orderno} /></td>
                        </tr>
                        <tr>
                            <td className="rtable_title">주문일자</td>
                            <td><input type="text" id="orderdt" name="orderdt" readOnly value={storeInfo.orderdt}/></td>
                        </tr>
                        <tr >
                            <td className="rtable_title">13. 주문시간</td>
                            <td><input type="text" id="ordertm" name="ordertm" readOnly value={storeInfo.ordertm} /></td>
                        </tr>
                        {/* API KEY field 삭제 */}
                        <tr > 
                            <td className="rtable_title">15. Hash Key</td>
                            <td id="hashtd"><input type="text" id="checkHash" name="checkHash" readOnly value={storeInfo.hash}/></td>
                            <td><span></span></td>
                            <td><input type="button" readOnly value="Hash Key 생성" /></td>
                        </tr>
                        <tr>
                            <td class="rtable_title">16. 가맹점예약필드1</td>
                            <td><input type="text" id="reserved01" name="reserved01" value={value.user} /></td>
                            <td colspan="2"><span>가맹점예약필드 1 (응답시 반환용)</span></td>
                        </tr>
                        <tr>
                            <td class="rtable_title">17. 가맹점예약필드2</td>
                            <td><input type="text" id="reserved02" name="reserved02" value={storeInfo.buyItemnm} /></td>
                            <td colspan="2"><span>가맹점예약필드 2 (응답시 반환용)</span></td>
                        </tr>
                    </table>
              
                    
                </form>
                </div>
            </STYLE> 
        </Fade>
    )
    
}

const STYLE = styled.div`
		/* IFrame */
		.paybox {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			padding: 0px;
			display: none;
		}
		.paymentmain {
			padding: 0px;
			height: 100%;
		}
		.closebtn {
			background: #4c7eaf;
			height: 28px;
			color: white;
			text-align: center;
			cursor: pointer;
			border:solid 1px black;
		}
		.payframe {
			width: 100%;
			height: 100%;
			border: 0px;
			background: white;
			border:solid 1px black;
		}
		.cover{
			position: absolute;
			left: 0px;
			top: 0px;
			width:100%;
			padding: 0px;
			height:100%;
			display: none;
			background: rgba(255, 255, 255, 0.6);
		}
        .order_info ul {
            list-style : none; padding: 0;
        }
        .order_info ul input {
            display: none;
        }
        .w-credit {
            width : 100vw; height: calc (100vh-51px); 
        }
        .w-content >div:first-child{
             text-align: center; padding: 16px 0px; 
        }
        .w-content >div:first-child div:first-child{
            width: 60px; height: 60px; left: 150px; top: 96px; background: #F8F8F8; border-radius : 50%; margin: auto;  line-height: 78px; margin-bottom:5px;
        }
        .w-content >div:first-child div:first-child img{
            width: 30px; height: 30px;  position: relative; top: 15px;
        }
        .w-content > *:not(:first-child),
        .w-content form > div {
            border-bottom: 1px solid  #F8F8F8; 
        }
        form > div p {
            font-weight: 400; font-size: 14px; letter-spacing: -0.05em; color: #5D6067; 
        }
        form > div:first-child p span {
            font-size: 15px; line-height: 24px; color: #35394A; padding-left: 16px;
        }
        form > div:nth-child(2) span:first-child {
            font-weight: 700; font-size: 16px; color: ${props=>props.color}; padding-left: 16px;
        }
        form > div:nth-child(2) span:last-child {
            font-weight: 700; font-size: 16px; color: #35394A; padding-left: 3px;
        }
        form > div:last-child ul{
             display: flex; flex-wrap: wrap;
        }
        form > div:last-child ul li {
            border: 1px solid #E8E8E8; border-radius: 8px; width: 48%; padding : 12px 10px; margin-bottom : 4%; font-weight: 500;
            font-size: 14px; color: #35394A;
        }
        form > div:last-child ul li:nth-child(odd) {
            margin-right : 4%;
        }
        form > div:last-child ul li label {
            display: flex; justify-content: space-between;
        }
    
`