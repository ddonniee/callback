import React, { useEffect, useState,useContext, useLayoutEffect } from "react";
import { Fade } from "react-reveal";
import moment from 'moment'
import * as config from '../config';
import styled from "styled-components";
// components
import Top from "../component/Top";
import { AppContext } from "../App";
import SettingModal from "../component/SettingModal";
import useConfirm from "../hooks/useConfirm";
// svgs
import Select from '../public/svg/arrow-bottom.svg'
import RSend from '../public/svg/send_red.svg'
import BSend from '../public/svg/send_blue.svg'
import Rec from '../public/svg/Rec.svg'
import RMB from '../public/svg/r_msg_blue.svg'
import RMR from '../public/svg/r_msg_red.svg'
import RNonRec from '../public/svg/rec_red.svg'
import BNonRec from '../public/svg/rec_blue.svg'
import BNull from '../public/svg/blue.svg'
import RNull from '../public/svg/red.svg'

export default function Log(props) {

    const value = useContext(AppContext);
    const {color,isSelected} = props;
    const [callbackList, setCallbackList] = useState([]);
    const [isClickDuration, setIsClickDuration] = useState(false);
   
    const [statusIcon, setStatusIcon] = useState({
        sendMMS : '',
        sendCall : '',
        recMMS : '',
        recCall : Rec,
        none : '',
        missing : '',
    });
    // 콜기록 조회기간 설정 옵션값 누락시뜨는 경고창 띄우는 state와 경고창에 표기할 메세지 설정
    const [alert, setAlert] = useState(false)
    // const [alertDetail, setAlertDetail] = useState({
    //     title:"",
    //     message:"",
    //     classTitle:""
    // });
    const [alertDetail, setAlertDetail] = useState({
        title:'', 
        message:'', 
        classTtitle:'', 
        isChoose:false, 
        buttonId:'',
        color:'', 
        buttonId:'', 
        overlayClassName:''
    });

    useLayoutEffect(()=>{

        if(color==='#E95548') {
            setStatusIcon({
                ...statusIcon,
                sendMMS : RSend,
                sendCall : RSend,
                recMMS : RMR,
                missing : RNonRec,
                none : RNull,
            })
        }else {
            setStatusIcon({
                ...statusIcon,
                sendMMS : BSend,
                sendCall : BSend,
                recMMS : RMB,
                missing : BNonRec,
                none : BNull,
            })
        }

    },[callbackList])


    
    function alertMSG(num) {

            if(num==1) {
                setAlertDetail({
                ...alertDetail,
                title:"항목 오류",
                message:"모든 항목을 선택해주세요.",
                classTitle:'error',
                isChoose:false, 
                color:color, 
                overlayClassName:'overlay-custom-class-name'
            })
            }else if(num==2) {
                setAlertDetail({
                ...alertDetail,
                title:"날짜 오류",
                message:"시작일과 종료일을 확인해주세요.",
                classTitle:'error',
                isChoose:false, 
                color:color, 
                overlayClassName:'overlay-custom-class-name'
                })
            }
            
        setAlert(!alert)
    }

    const [search, setSearch] = useState({
        sort : '전체',
        start_date : "전체",
        end_date : "전체"
    })


    /**
     * 함수명 : getCallbackList
     * 함수 작성자 : 이은정
     * 기능 : 사용자 설정값에 따라 서버에서 콜백리스트 통신
     */
    function getCallbackList() {

        if(search.start_date>search.end_date) {
            alertMSG(2)
        }else {
            async function fetchRecords() {
                await fetch(config.URL_ADDRESS+config.SEARCH_LOG+'/'+value.user+'/'+search.sort+'/'+search.start_date+'/'+search.end_date, {
                mode: 'cors',
                headers : {
                    'Accept':'application/json',
                    'Authorization': 'Bearer ' + value.token,
                }
            })
            .then(res=> {
                return res.json();
            })
            .then(data => {
                let arr=[];
                data.map((d,index)=>(
                    d.user_id===value.user
                    ?
                    (
                    d.receiverNum = (d.phone).split(',').length,
                    arr[index]=d
                    )
                    :
                    null
                ))
                setCallbackList(data);
            }
            )
            .catch(error=>{
                console.log(error)
            })
        }
        fetchRecords() 
        }
    }
    /**
     * 함수명 : onLoadSettingModal 
     * 함수 작성자 : 이은정
     * 기능 : SettingModal 컴포넌트 여닫는 함수
     */
    function onLoadSettingModal() {
        setIsClickDuration(!isClickDuration)
    }
    let [confirmModal]= useConfirm(alertDetail,close);
    /**
     * 함수명 : confirm
     * 함수작성자 : 이은정
     * 기능 : alert창 뜰 때 실행할 action 값 줄 수 있음 => 그냥 창닫기 or 확인 버튼을 누르며 추가 설정할지..
     */
    function confirm () {
        console.log(alertDetail.title,'alertDetail')
        confirmModal();
        setAlert(false)
        setAlertDetail({
            ...alertDetail,
            title:"",
            message:"",
            classTitle:'',
            isChoose:false, 
            color:"", 
            overlayClassName:''
            })
    }
    function close() {
        setAlert(false)
    }
    

    /**
     * 함수명 : onSearchRange
     * 함수 작성자 : 이은정
     * 기능 : 사용자 선택값에 따라 콜백 기록 조회, sort => 자동, 수동 / date => 날짜 조회 기준 / start,end => date 직접 입력 선택시 해당 날짜, 아닐시 기준값 (ex)오늘, 1개월..)
     * @param {string} date // 전체, 오늘, 1개월, 3개월, 직접입력등 string 값으로 전달
     * @param {string} sort // 전체, 자동, 수동, 선택
     * @param {string} start // date picker 선택시 onChnage 함수로 설정된 날짜값, new Date객체로 받아옴 format('YYYY-MM-DD')
     * @param {string} end // date picker 선택시 onChnage 함수로 설정된 날짜값, new Date객체로 받아옴 format('YYYY-MM-DD')
     */
    function onSearchRange(date,sort,start,end) {
        
        let d = date;
        let s = sort;

        if(date === undefined || sort === undefined) {
            alertMSG(1)
        }
        else {
            if(d==='직접입력') {
                setSearch({
                    ...search,
                    sort:s,
                    start_date:moment(start).format('YYYY-MM-DD'),
                    end_date:moment(end).format('YYYY-MM-DD')
                })
            }
            else {
                setSearch({
                    ...search,
                    sort:s,
                    start_date:d,
                    end_date:d
                })
            }
            setIsClickDuration(false);
        }
    }
    useEffect(()=>{
        getCallbackList()
    },[search])
    useEffect(()=>{
        getCallbackList()
    },[])


    return (
        
        isSelected &&
        
        <Fade>
        <div className="w-log">
            
            <Top theme={color} logo={null} icon={null} mypage={null} back={true} title="콜백기록" bgColor="white"></Top>
            <LogStyle>
            <div className="log-content">
                <div className="w-content">
                    <Button>
                    <div className="select_box" onClick={onLoadSettingModal}>
                        <div><p>조회기간 설정</p></div>
                        {/* <div><img src={Select} /></div> */}
                        <div ><img src={Select}/></div>
                    </div>
                    </Button>
                    <div className="log-count">
                      <p>총 {callbackList.length}건</p>  
                    </div>

                    <div className="log-lists">
                         <List>
                         <ul style={{padding:0}}>
                        {callbackList.map((call)=>{
                            return (
                                <li>
                                <div className="icon">
                                    {
                                        call.status==='문자발신'
                                        ?
                                        <img src={statusIcon.sendMMS}/>
                                        :
                                        call.status==='전화발신'
                                        ?
                                        <img src={statusIcon.sendCall}/>
                                        :
                                        call.status==='문자수신'
                                        ?
                                        <img src={statusIcon.recMMS}/>
                                        :
                                        call.status==='전화수신'
                                        ?
                                        <img src={statusIcon.recCall}/>
                                        :
                                        <img src={statusIcon.none}/>
                                    }
                                </div>
                                <div className="detail">
                                    <p>{call.receiverNum}명</p>
                                    <p>{call.sort}·{call.status}</p>
                                </div>
                                <div className="date">{moment(call.send_date).format('YYYY.MM.DD HH:mm')}</div>
                            </li>
                            )
                        })}
                        </ul> 
                        </List>
                       
                    </div>
                    
                </div>
               
            </div>
            </LogStyle>

            {
            isClickDuration
            ?
            <SettingModal title="조회기간 설정" color={color} onClick={setIsClickDuration} setSearchFilter={onSearchRange} isDuration={true}/>
            :
            null
        }
                {
               alert
               ?
               confirm()
               :
                null}     
        </div>

       
    </Fade>
        
    )
    
}


const LogStyle = styled.div`

    .log-content {
        width: 90%; 
        position:relative;
        top : 30px;
        margin-left : auto;
        margin-right : auto;
    }
    
    .w-content {
        width: 100%;
    }
    .log-count {
        font-weight: 600;
        font-size: 13px;
        line-height: 22px; letter-spacing: -0.05em;color: #5D6067; padding-top:10px;
    }
`
const Button = styled.div `
box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.07);
border-radius: 100px;
    .select_box {
        display : flex;
        justify-content : space-between;
        height : 50px;
        padding : 3px;
        align-items : center;
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 24px;
        color: #5D6067;
    }
    .select_box > div {
        padding : 0px 20px;
    }
`

const List = styled.ul `
    list-style : none;
    padding : 0;
    margin : 0;
    width : 100%;
    left : 0;
    li {    
        list-style : none;
        display : flex;
        justify-content : space-between;
        height : 70px;
        color: #35394A;
        font-family: 'Noto Sans KR';
        font-style: normal;
    }
    li div {
        margin-top : auto;
        margin-bottom : auto;
        padding-left : 3px;
    }
    li div:nth-child(2) {
        width : 50%;
        align-item: center;
    }
    li div:last-child {
        font-weight: 400;
        font-size: 12px;
        line-height: 22px;
        color: #8C969F;
    }
    li div p {
        margin : 0;
        
    }
    li div p:first-child {
        font-weight: 700;
        font-size: 14px;
    }
    li div p:last-child {
        font-weight: 500;
        font-size: 12px;
    }
`