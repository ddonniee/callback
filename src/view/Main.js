/* eslint-disable */
import React, { useEffect, useState, useRef, useLayoutEffect, useContext } from "react";
import { Link  } from "react-router-dom";
import { Fade } from "react-reveal";
import Carousel from 'react-bootstrap/Carousel'
import CarouselItem from "react-bootstrap/esm/CarouselItem";
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import $ from 'jquery';
import * as config from '../config';
import '../public/css/style.css'
// components
import Top from "../component/Top";
import Button from "../component/Button";
import Popup from '../component/Popup';
import FloatBtn from "../component/FloatBtn";
import Loader from "../component/Loader";
import ModifyContent from '../component/ModifyContent';
import { AppContext,MemberContext } from "../App";
import useConfirm from "../hooks/useConfirm";
// svg files
import TopTo from '../public/svg/arrow-top.svg'
// svgs
import styled from "styled-components";

export default function Main(prop) {

    const theme = prop.theme;
    const value = useContext(AppContext);
    const member = useContext(MemberContext);
    const [userIdToGetContactList,setUserIdToGetContactList] = useState()   // 서비스 이용기간 남았을때만 네이티브에서 연락처접근할 수 있도록 
    const [cards, setCards] = useState([])                                  // 사용자 앞으로 생성된 콜백 카드 저장, 스크롤로 10개씩 fetch
    const [autoIdx, setAutoIdx] = useState();                               // 자동발송 설정된 카드번호
    const [check, setCheck] = useState(false);                              // 즐겨찾기 3개 이상 선택시 경고창 띄움
    const [pop, setPop] = useState({                        // popup창 오픈여부와 오픈시 팝업창에 기재할 텍스트 저장
        pName : null,
        status : false,
        top : '',
        toggle : false,
    }); 
    const [bookmark, setBookmark] = useState({              // 즐겨찾기 설정된 카드 번호와 개수 저장
        lists : [],
        count : 0,
    })
    const [isOpen, setIsOpen] = useState(false);
    const [info, setInfo] = useState({                      // 사용자 id를 통해 사용자 개인정보 저장
        "user_id": null,
        "phone": "",
        "email": "",
        "status": -1,
        "party": -1,
        "signup_date": "",
        "exp_date": "",
        "service": null,
        "profile": "",
        "ispayment": "N"
      })                   
    const textLimit = useRef(300);                           // 콜백 카드 생략 기준 글자수
    const [isShowMore, setIsShowMore] = useState(false);     // 콜백 카드 생략된 글자 게시 여부
    const [isDelete, setIsDelete] = useState(false)          // confirm창에서 취소 누르면 confirm창 종료 
    const [deleteDone, setDeleteDone] = useState(false)      // 사용자에게 콜백카드 삭제 여부 확인, 삭제될경우 안내 팝업띄울때 추적하는 state
    // const [isMembership, setIsMembership] = useState(false)  // 결제여부확인하여 문자차단 및 화면 설정
    const [pages, setPages] = useState({                // 스크롤링시 서버에 요청할 페이징넘버
        start:1,
        end:10
    })
    const [target, setTarget] = useState(null);        // 화면 스크롤시 최하단에 있는 콜백카드를 타겟팅
    const [isLoading, setIsLoading] = useState(false); // data 요청중인지 확인
    const [maxCard, setMaxCard] = useState(0);         // 사용자앞으로 생성된 콜백카드 갯수, 최대갯수와 scrolling하여 받아온 갯수가 일치하면 서버에 요청중단
    const [isConfirm, setIsConfirm] = useState(false)  // confirm창 오픈 여부
    /**
     * 함수명 : getContactList
     * 함수작성자 : 이은정
     * 기능 : 연락처 화면 호출하는 네이티브 함수 호출
     * @param {number} num card_id 
     * @returns 
     */
    function getContactList(num) {
        if(!member.isMember){
            confirm(3)
            return false;
        }
        else {
            let card_num = num;
            setUserIdToGetContactList(window.Android.ShowContact(card_num))
            return userIdToGetContactList;
        }
    }
    /**
     * 자동발송, 즐겨찾기 설정함수
     * @param {object} event
     * @param {number} index
     * @param {number} card_id 
     * @returns 자동발송은 서버에 설정, 카드에 설정/해제 확인 가능
     */
    const onChangeState=(e,index,cd)=> {
        const idx = index;
        const card = cd;
        const option = e.target.className;
        if(isOpen) {
            return false;
        }
        const response = {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type':'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + value.token,
            },
            redirect:'follow',
            body:JSON.stringify({
                "card_id":card,
              })
        }
        let url = config.URL_ADDRESS;
        let isChecked = false;
        /**
         * setIsOpen(true)은 즐겨찾기/자동발송 더블클릭 방지, CSS때문에 필수
         */
        if(option==='auto_btn' || option==='edit_txt') {
            setIsOpen(true)
            if(autoIdx===card) {
                isChecked = true
            }else {
                isChecked = false;
            }
            let temp_card = card;
            if(isChecked) {
                url += config.DELETE_AUTO_LIST+value.user;
                temp_card = -1;
            }
            if(!isChecked) {
                url += config.UPDATE_AUTO_LIST+value.user;
                temp_card = card;
            }
            fetch(url, response)
            .then((res)=> {
                res.json();
            })
            .then((data)=>
               setAutoIdx(temp_card),
               option === 'auto_btn' ? onPopup(e,idx,isChecked,card) : setIsConfirm(true),
               window.Android.SaveAutoMessage(card)
            )
            .catch((err)=> {
                console.log(err)
            })
        }
    if(option==='fav_btn') {
        setIsOpen(true)
        let cnt = -2; 
        // bookmark 여부 확인하여 신규설정 or 해지
        for(let i=0; i<bookmark.count; i++) {
            if(bookmark.lists[i]==card) {
                cnt = i;
                // idx = i;
                i = bookmark.count;
            }
            else {
                cnt = -2;
            }
        }
        let copyList = bookmark.lists
        if(cnt === -2 && bookmark.count < 3) {
            url += config.UPDATE_BOOKMARK_LIST+value.user;
            copyList.push(card)
            onPopup(e,idx,false,card)
            $('#bmk'+card).attr("src",theme.book_on)
        }else if(cnt === -2 && bookmark.count===3) {
            setCheck({
                ...check,
                status:true
            })
            setIsOpen(false)
            return false;
        }else if(cnt !== -2 && bookmark.count !== 0) {
            url +=config.DELETE_BOOKMARK_LIST+value.user;
            copyList.splice(cnt,1)
            onPopup(e,idx,true,card)
           
            $('#bmk'+card).attr("src",theme.book_off)
        }
        setBookmark({
            lists:copyList,
            count:copyList.length
        })
            fetch(url, response)
            .then((res)=> {
                 return res.text()
            })
            .catch((err)=> {
                console.log(err)
            })
       }

       let newAlert = [...cards]
       newAlert[index] = {
           ...newAlert[index],
           alert : {
               isClicked : true
           }
       }
       setCards(newAlert)
       setTimeout(function() {
        setIsOpen(false)
       },2500)
    }
    /**
     * @param {number} num 1:즐겨찾기 설정안내 / 2:콜백문자 삭제 안내 / 3:서비스 만료 안내 / 4:자동발송 서정 안내 => 멘트 state로 설정
     * @param {object} e // event 객체 전달
     * @param {number} idx // 자동발송 설정해제 선택시 전달하는 카드 인덱스값
     * @param {number} num2 // 카드번호 
     */

    // react-confirm-alert 라이브러리에 필요한 옵션값을 state로 저장, 모달창이 필요한 여러버튼에서 사용시 state값을 업데이트한다.
     const [alertDetail, setAlertDetail] = useState({
        title:"",
        message:"",
        classTitle:'error',
        isChoose:false, 
        buttonId:'',
        color:theme.btnColor, 
        action:null,
        overlayClassName:'overlay-custom-class-name'
    })

    let [confirmModal] =useConfirm(alertDetail, close)
    function close() {
        setCheck({
            ...check,
            status:false
        })
    }
    /**
     * 함수명 : confirm
     * 함수작성자 : 이은정
     * 기능 : 모달창을 여는 custom hooks를 로드하는함수
     */
    const confirm =()=>{
        confirmModal()
        setCheck({
            ...check,
            status:false
        })
    }
    /**
     * 함수명 : alertMSG
     * 함수작성자 : 이은정
     * 기능 : 모달창이 필요한 버튼 클릭시에 모달창에 들어갈 안내멘트와 콜백함수를 세팅하는 함수, confirm()함수를 통해 confirm component를 로드한다. 
     * @param {number} num 1=즐겨찾기 최대 등록 안내, 2=콜백문자 삭제 전 확인 안내, 3=이용 기간 만료시 결제 페이지로 이동, 4=자동발송메시지를 편집하려고 할 때, 자동 발생 해제 여부 확인 
     * @param {object} e evnet 객체 
     * @param {number} idx click된 카드 index 번호
     * @param {number} num2 click된 카드의 카드 번호, 설정과 삭제를 위해 필요
     */
    const alertMSG = (num,e,idx,num2) => {
        if(num===1) {
            setAlertDetail({
                ...alertDetail,
                title:"즐겨찾기 설정안내",
                message:"즐겨찾기는 최대 3개까지만 등록할 수 있습니다.zz \n 즐겨찾기에 등록된 문자를 해제 후 등록해주세요.",
                isChoose:false, 
                action:null,
                buttonId:'confirm_txt',
                overlayClassName:'overlay-custom-class-name'
            })
        }
        else if(num===2) {
            setAlertDetail({
                ...alertDetail,
                title:"콜백문자 삭제안내",
                message:"해당 문자를 삭제하시겠습니까? \n삭제된 문자는 복구가 불가능합니다.",
                isChoose:true, 
                action:()=>{deleteCallbackCard(e,idx,num2)},
                buttonId:'confirm_txt',
                overlayClassName:'overlay-custom-class-name'
            })
        }
        else if(num===3) {
            setAlertDetail({
                ...alertDetail,
                title:"서비스 만료 안내",
                message:"콜백 서비스 이용기간이 만료되었습니다. \n결제페이지로 이동하시겠습니까?",
                isChoose:true, 
                action:()=>{window.location.assign('/payment')},
                buttonId:'confirm_txt',
                overlayClassName:'overlay-custom-class-name'
            })
        }
        else if(num===4){
            setAlertDetail({
                ...alertDetail,
                title:"자동발송 설정안내",
                message:"자동발송 설정중인 글은 수정 및 삭제가 불가능합니다. \n자동발송을 해제하시겠습니까?",
                isChoose:true, 
                action:()=>{onChangeState(e,idx,num2)},
                buttonId:'confirm_txt',
                overlayClassName:'overlay-custom-class-name'
            })
        }
        confirm(num,e,idx,num2)
      };
      /**
       * @param {object} e event 객체
       * @param {number} index popup창 띄울 카드 index 값
       * @param {boolean} isChecked 자동발송/즐겨찾기 설정 유무 확인으로 popup창 메시지 설정
       * @param {number} card 카드번호 전달
       * @returns 자동발송/즐겨찾기 설정이 되면 안내 팝업 띄움
       */
    const onPopup=(e,index,isChecked,card)=>{
        const name = e.currentTarget.getAttribute('name')
        const isAlready = isChecked;
        const input_id = '#'+card; 
        const e_top = $(input_id).position();
        const e_pop = e_top.top+40+'px';
        if(e.target.className==='edit_txt') {
            isAlready=true;
        }
        if(index===-1) {
            return false
        }
        $('.popup').css('top',e_pop);
            setPop({                    
                ...pop,
                pName : name,
                status :true,
                top : e_pop,
                toggle : isAlready, 
            })
    }
    /**
     * @param {object} e event 객체
     * @param {number} index 콜백 카드 인덱스 값 전달
     * @param {number} user_id 사용자 id
     * @param {number} card_id 카드 id
     * @param {number} autoidx 서버에 설정된 자동발송 카드 id전달
     * @return 카드마다 편집하기 창 열고 닫는 함수 
     */
    const onEdit=(e,index,user_id, card_id, autoidx)=>{

        if (autoidx === card_id) {
            alertMSG(4,e,index,card_id)
        } else {
            e.preventDefault();
            const idx = index;
            var newCards = [...cards];
                newCards[idx] = {
                    ...newCards[idx],
                    modal :!newCards[idx].modal
                }
            setCards(newCards);
        }
    }
    /**
     * 함수명 : deleteCallbackCard
     * 함수작성자 : 이은정
     * 기능 : 콜백카드 삭제
     * @param {object} e event 객체
     * @param {numbrt} idx 인덱스값
     * @param {number} num 카드 id
     * @return 콜백카드삭제
     */

    const deleteCallbackCard=(e,idx,num)=>{
        const t_idx = idx;
        const lists = [...cards];
        const card = num;
        const data = {
            card_id:card
        }
        fetch(config.URL_ADDRESS+config.DELETE_CARD+value.user, {
            method:"PATCH",
            headers:{
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + value.token,
            },
            redirect:'follow',
            body: JSON.stringify(data),
        })
        .then((res)=>
             res.text()
        )
        .then((data)=>
            lists(t_idx).modal=false,
            lists.splice(t_idx, 1),
            setCards(lists),
            setDeleteDone(!deleteDone),
            updateBookarkAfterDelete(card)
        )
        .catch((err)=>
        console.log(err)
        )
    }
    /**
     * 함수명 : updateBookmarkAfterDelete
     * 함수작성자 : 이은정
     * 기능 : 카드 삭제시 state에 저장된 bookmark list에서도 삭제하여
     *        다른 카드 즐겨찾기 등록 가능하도록 변경
     * @param {number} card 삭제된 카드 id 
     */
    function updateBookarkAfterDelete (card) {
        let copy= bookmark.lists;
        for(let i=0; i<copy.length; i++) {
            if(copy[i]===card) {
                copy.splice(i,1)
            }
        }
        setBookmark({  // bookmarked된 카드의 번호와 갯수를 업데이트함
            ...bookmark,
            lists:copy,
            count:copy.length
        })
    }
    /**
     * 함수명 : onScrollToTop
     * 함수작성자 : 이은정
     * 기능 : 클릭이벤트 발생시 화면을 top으로 보내주는 함수
     * @param {object} e event 객체 
     */
    const onScrollToTop=(e)=>{
        e.preventDefault(); 
        document.getElementById('smsmain').scrollIntoView(document.getElementsByClassName('main-content'))
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
      }
      /**
       * 함수명 : loadPage
       * 함수작성자 : 이은정
       * 기능 : parameter로 넘어온 url주소로 화면 전환
       * @param {string} u url 주소 값
       */
      function loadPage(u) {
        let url = u;
        window.location.assign(url)
      }

      useEffect(()=>{
          for(let i=0; i<cards.length; i++) {
              if(cards[i].modal.status === true) {
                let click = window.event.clientY;
         
                click += 30;
                click += "px"
                
              }
          }
      },[])

    /**
     * 함수명 : getSettingPageFromNative
     * @returns 네이티브로 설정화면 연결
     */
    function getSettingPageFromNative() {
        return window.Android.ShowSetting();
    }
    /**
     * 함수명 : contentMore
     * 함수작성자 : 원은정
     * 기능 : 글자 수 300자 초과시 숨겨진 글자 더 불러오는 
     * @param {number} card card_id
     * @returns 
     */
    function contentMore(card) {
        const shortReview = card.content.substring(0, textLimit.current);
        if(card.content.length > textLimit.current) {
            if(isShowMore) {return card.content}
            return shortReview;
        }
        return card.content;
    }
    function offAlert() {
        let copy = [...cards]
        setTimeout(function() {
            for(let i=0; i<copy.length; i++) {
                copy[i].alert.isClicked = false
           }
           setCards(copy)
           
        },2500)
    }

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
    },[])
    useEffect(()=>{
        if(autoIdx===-1 && isConfirm) {
            setPop({
                ...pop,
                toggle : true
            })
        }
        else {
            setPop({
            ...pop,
            toggle : true
        })
        setIsConfirm(false)
        }
    },[isConfirm])
    useEffect(()=>{
        fetch(config.URL_ADDRESS+config.LENGHT_CALLBACK_LIST+value.user, {
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
                setMaxCard(data[0].card_cnt)
            })
    },[info])
    useEffect(()=>{
        fetchCards();
    },[maxCard])
    useEffect(()=>{
        let observer;
        const options = {
        root: null,
        rootMargi: '0px',
        theshold: 1.0
        }
        if(target && pages.start!==1) {
        const onIntersect = async ([entries], observer) => {
            if(entries.isIntersecting) {
                if(cards.length%10===0) {
                    setIsLoading(true)
                    observer.unobserve(entries.target);
                    await fetchCards();
                    observer.observe(entries.target)
                    setIsLoading(false)
                }
            }
        }
            observer = new IntersectionObserver(onIntersect, options)
            observer.observe(target);
        }
        return () => observer && observer.disconnect();
    },[target])
        const fetchCards = async()=> {
            if(pages.start > maxCard) return false;
            await fetch(config.URL_ADDRESS+config.SEARCH_CALLBACK_LIST+'/'+value.user+'/'+pages.start+'/'+pages.end, {
                mode: 'cors',
                headers: {
                    'Accept':'application/json',
                    'Authorization': 'Bearer ' + value.token,
                }
            })
            .then (res=>{
                return res.json();
            })
            .then (data=> {
                const lists =[];
                const idxs =[];
                let count = 0;
                data.map((d,index)=>(
                    
                    d.modal = false,
                    d.alert = {
                        isClicked : false,
                    }
                    ,
                    d.auto_send === 1 ?
                    setAutoIdx(d.card_id)
                    :
                    null
                    ,
                    d.bookmark === 1
                    ?
                    <>
                    {lists[count]=d.card_id}
                    {count++}
                    {idxs[index]=index}
                    </>
                    :
                    null
                ))
                setCards(cards.concat(data));
                let tempdata = {lists,count}
                setBookmark(tempdata)
                if(data.length%10===0) {
                    setPages({
                        ...pages,
                        start: pages.start+10,
                        end: pages.end+10
                    })
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    // 즐겨찾기, 자동발송 설정/해제 및 카드 삭제시 alert 창 띄우는 state 값을 바꿈
    useEffect(()=>{
        if(!deleteDone) {
            for(let i=0; i<cards.length; i++) {
                if(cards[i].alert.isClicked) {
                    offAlert();
                }
            }
        }
        else if(deleteDone) {
            let alertTimer = setTimeout(()=>{
                setDeleteDone(!deleteDone)
            },2500)
            return()=>{
            clearTimeout(alertTimer)
        }
        }
        
    },[cards,deleteDone])

    return (
        <Fade clear>
            <STYLE isMembership={member.isMember} color={theme.btnColor}>
        <div className="main" id="smsmain">
            <Top theme={theme} logo={true} icon={true} mypage={true} title={false} back={false} onClick={getSettingPageFromNative}/>
            <div className="main-content" style={{"backgroundColor":theme.bgColor,paddingBottom:"30px", marginBottom:0}} >
        
            {/* border 속성 없을시 배경색 지워짐 by 2은정 */}
            <div className="background" style={{"border":`1px solid ${theme.bgColor}`, display:"inline"}}>
            
            <div className="user-type">
                <img src={theme.banner} alt="banner"/>
               
                    <div className="desc">
                       {
                       !member.isMember
                       ?
                       <div>
                            <p>{member.leftDays <= 0 ? `이용기간이`: `무료 이용기간 `}</p>
                           <p>{member.leftDays <= 0 ? null : member.leftDays}</p>
                           <p style={{"fontWeight": member.leftDays <= 0 ? '700':'500', "position":"relative", "left": member.leftDays <= 0 ? "3px":"0px"}}>{member.leftDays <= 0 ? `만료되었습니다.` : `일`}</p>
                           </div>
                       :
                       <div>
                        <p>{member.leftDays <= 0 ? `이용기간이`: `남은 이용기간 `}</p>
                           <p>{member.leftDays <= 0 ? null : member.leftDays}</p>
                           <p style={{"fontWeight": member.leftDays <= 0 ? '700':'500', "position":"relative", "left": member.leftDays <= 0 ? "3px":"0px"}}>{member.leftDays <= 0 ? `만료되었습니다.` : `일`}</p>
                           </div>
                        }
                       
                   </div>
                   <Link to="/payment">
                    <p>기간 연장</p>
                   </Link>
                
            </div>
            
            {cards.length !== 0
            ?
            cards.map((card, index)=>{    
                return(
                <div className="list" key={`card`+index} id={card.card_id} ref={setTarget}>
                <div className="list-top">
                    <input type="button" className="send" id={`snd`+index} style={{"display":"none"}} ></input>
                    <label htmlFor={`snd`+index} onClick={(e)=>onChangeState(e,index,card.card_id)} className="auto_btn" id={index} name="auto_send">
                   
                        {card.card_id===autoIdx
                        ?
                        <>
                        <img id={"autoimg"+index} src={theme.auto_on} alt="autosend"/>
                        </>
                        :
                        <img id={"autoimg"+index} src={theme.auto_off} alt="autosend"/>}
                        자동발송</label>
                        
                    <input type="button" className="fav" id={`i-fav-`+index} style={{"display":"none"}}></input>
                    <label htmlFor={`i-fav-`+index} onClick={(e)=>onChangeState(e,index,card.card_id)} className="fav_btn" name="bookmark">
                       
                            {bookmark.lists.includes(card.card_id)
                            // {card.bookmark===1
                            ?
                            <img id={`bmk`+card.card_id}  src={theme.book_on} alt="bookmark" />
                            :
                            <img id={`bmk`+card.card_id} src={theme.book_off} alt="bookmark" />  
                            }
                           
                        즐겨찾기</label>
                        <div className="edit" onClick={(e)=>onEdit(e,index, card.user_id,card.card_id,autoIdx)} name="auto_send"><p className="edit_txt"  style={{color:theme.btnColor}} id={card.card_id} title={index} name={index}>편집하기</p>
                        {
                        card.modal
                        ?
                        <ModifyContent idx={index} num={card.card_id} theme={theme} onClick={(e)=>alertMSG(2,e,index,card.card_id)}/>
                        :
                        null
                        }
                        
                        </div>
                </div>
                <CAROUSEL color={theme.btnColor}>
                <div className="list-img                                                                                                                                                                                                                                                                                                                                                                        " style={card.img_path1===null ? {display:"none"}:null}>
                    <Carousel
                    //showThumbs={true}
                    showstatus="false"       
                    slide={true}
                    interval={null}
                    // onSlide={(key, direction)=>onSlideChange(key,direction)}
                    indicators={true}
                    prevLabel={false}
                    nextLabel={false}
                    controls={true}
                    >
                        {card.img_path1 !== null
                        ?
                        <CarouselItem>
                        <div>
                        <img src={card.img_path1} className="my-img" alt="callback_img"/>
                        </div>
                        </CarouselItem>
                        :
                        null
                        }
                        {card.img_path2 !== null
                        ?
                        <CarouselItem>
                        <div>
                        <img src={card.img_path2} className="my-img" alt="callback_img"/>
                        </div>
                        </CarouselItem>
                        :
                        null
                        }
                        {card.img_path3 !== null
                        ?
                        <CarouselItem>
                        <div>
                        <img src={card.img_path3} className="my-img" alt="callback_img"/>
                        </div>
                        </CarouselItem>
                        :
                        null
                        }
                        {card.img_path4 !== null
                        ?
                        <CarouselItem>
                        <div>
                        <img src={card.img_path4} className="my-img" alt="callback_img"/>
                        </div>
                        </CarouselItem>
                        :
                        null
                        }
                        {card.img_path5 !== null
                        ?
                        <CarouselItem>
                        <div>
                        <img src={card.img_path5} className="my-img" alt="callback_img"/>
                        </div>
                        </CarouselItem>
                        :
                        null
                        }
                        
                 
                    </Carousel>
                </div>
                </CAROUSEL>
                <div className="list-info" >
                    <p>
                        {contentMore(card)}
                        <span className="list-showMore" onClick={() => setIsShowMore(!isShowMore)}>
                            {(card.content.length > textLimit.current) &&
                            (isShowMore ? '\t닫기' : '...\t더보기')}
                        </span>
                    </p>
                    {/* <p>내 프로필 : <a target="/blank" href="https://www.pospot.kr">www.pospot.kr</a></p> */}
                </div>
                
                    <Button txt="문자전송" color={theme.btnColor} onSubmit={(e)=>getContactList(card.card_id)} />
                
                {card.alert.isClicked
                ?
                <Popup txt={pop.pName} state={pop.status} top={pop.top} toggle={pop.toggle}/>
                :
                null
                }
            </div>
                )
                }) 
                :
                <div className="list none" style={{ paddingBottom:"10px"}}>
                    <div className="no-list" >
                        <img src={theme.empty} alt="new-card"></img>
                        <p>{`작성된 콜백 문자가 없어요.\n 콜백 문자를 작성하시고 서비스를 이용해 보세요.`}</p>
                    </div>
                    <Button txt="콜백작성" color={theme.btnColor} link="/create"/>
                </div>
            }
            {check.status
            ?
            alertMSG(1)
            :
            null
            }
            {
                deleteDone
                ?
                <Popup txt='delete' toggle={undefined} msg="가 완료되었습니다." />
                :
                null
            }
        </div>
            </div>
                    {
                    cards.length !== 0
                    ?
                    <div className="floats" >
                        <Link to="/create"><FloatBtn name="add_card" icon={theme.float} /></Link>
                        <FloatBtn  name="scroll_to_top" icon={TopTo} onClick={(e)=>onScrollToTop(e)}/>
                    </div>
                    :
                    null
                }
            {isLoading && <Loader isCenter={true} color={theme.btnColor}/>}
            </div >
            </STYLE>
        </Fade>
    )
}


const STYLE = styled.div`
white-space:pre-wrap;
/* main */
.main,
.main-content {
    height :fit-content;
    min-height: 100vh; 
}
.main-content > div > .user-type,
.main .none-content .user-type {
    background-color: white; margin: auto; width: 90%;border-radius: 20px; display: flex; position: relative;  padding: 16px 25px; box-shadow: 16px 13px 23px rgba(0, 0, 0, 0.07);
}
.main-content > div > .user-type > *:first-child,
.main-content > div > .user-type > *:last-child,
.main .none-content .user-type div:first-child,
.main .none-content .user-type div:last-child {
    flex-grow: 1;
}
.main-content > div > .user-type > *:nth-child(2),
.main .none-content .user-type div:nth-child(2) {
    flex-grow: 8; padding-left: 10px; display: ${props=>props.isMembership ? "flex":null}
}
.main-content > div > .user-type > *:nth-child(2) > p:first-child{
    font-weight: 800; font-size: 14px; line-height: ${props=>props.isMembership ? "32px;":"20px;"}  margin: 0; 
}
.user-type > img {
    width: 32px;
}

.main-content > div > .user-type > .desc > div{
     display: flex; vertical-align: middle; 
}
.main-content > div > .user-type > div p:first-child {
    font-weight: 700; font-size: 14px; border:1px solid transparent;
}
.main-content > div > .user-type > div p:nth-child(2) {
     color: ${props=>props.color};  margin-left: ${props=>props.isMembership ? "10px;":"0px;"} font-weight: 500; font-size: 15px; margin-top: 14px; 
}
.main-content > div > .user-type > div p:last-child {
     font-size: 14px; line-height: 22.5px; 
}
.main-content > div > .user-type > a {
    text-align: center; margin-top: auto; margin-bottom: auto; text-decoration: none;  padding-top:5px;
    border:1px solid #E8E8E8; border-radius: 16px; width: 58px;
    height: 32px;
}
/* .main-content > div > .user-type a div */
.main-content > div > .user-type > a > p{
    font-weight: 400;
    font-size: 11px;
    line-height: 20px;
    letter-spacing: -0.05em;
    text-decoration:none;
    margin-top: auto;
    margin-bottom: auto;
    display: flex; align-items: center; 
    justify-content: center;
    color:#5D6067;;
}
.react-confirm-alert-body {
    width: 90% !important; 
}
.main-content > div > .user-type a div:visited {
    text-decoration: none; color:#35394A;
}
@media only screen and (min-width : 830px) {
    .main-content > div > .user-type > *:nth-child(2) > p:first-child{
        font-weight: 800; font-size: 16px; line-height: 22px; margin: 0;
    }
    .main-content > div > .user-type > *:nth-child(2) > div{
        font-weight: 600; font-size: 14px; line-height: 24px; display: flex; margin: 0; 
    }
    .main-content > div > .user-type a img {
        width: 35px; margin: 0; padding: 0; padding-top: 5px; 
    }
}
.main-content .list,
.main-content .none {
    width: 90%; background-color: white; margin: auto; position: relative; top: 30px; border-radius: 20px; box-shadow: 16px 13px 23px rgba(0, 0, 0, 0.07); margin-bottom: 16px;
     overflow:unset; height:auto;
         /* max-height: 650px; min-height: 350px;  */
}
.main-content .none{
    padding-bottom: 2em !important; 
}
.main-content .list .btn-wrapper {
    width: 90%;
    margin-left: auto;
    margin-right: auto; padding-bottom: 16px;
    padding-top: 20px; 
}
.main-content .list .list-top {
    display: flex; padding: 15px;
}
.main-content .list .list-top * {
    margin: 0;
} 

.main-content .list .list-top label {
    display: flex;   font-weight: 400; font-size: 12px; line-height: 20px; padding-right: 11px;
}
.main-content .list .list-top label img {
    padding-right: 2px;
}
.main-content .list .list-top .edit .edit_txt{
    font-weight: 500; font-size: 12px; color:var(--color-main-blue); line-height: 20px;
}
/* .main-content .list .list-top div:first-child, */
.main-content .list .list-top .edit {
    flex-grow: 2; text-align: end;  text-decoration: none; position: relative; 
}
.main-content .list .edit > div {
    position: absolute; background-color: white; width: 124px; height: 89px;
    text-align: initial; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.07);
    border-radius: 8px; right: 12px; top: 50px; z-index: 100;
} 
.main-content .list .edit > div div {
    display: flex; justify-content: space-evenly; height: 50%; align-items: center;
}
.main-content .list .edit > div div div {
    justify-content: space-evenly;
}
.main-content .list .edit > div div p {
    font-style: normal; font-weight: 400; font-size: 14px; line-height: 24px; letter-spacing: -0.05em; color: var(--color-dark-icon);

}
/* 갤럭시 폴드 */
@media only screen and (min-width : 830px) {
    .main-content .list,
    .none-content .list {
    width: 90%; background-color: white; margin: auto; position: relative;  border-radius: 20px; box-shadow: 16px 13px 23px #e8e8e8; margin-bottom: 16px;
    min-height: 450px; display: block;
    /* max-height: 650px; */
    }
    
    .main-content .list label img,
    .none-content .list label img {
        width: 25px; padding-bottom: 5px; 
    }
    .main-content .list .list-top {
        padding: 1em 1.5em;
    }
    .main-content .list .list-top label {
        display: flex;   font-weight: 500; font-size: 16px; line-height: 20px; padding-right: 11px;
    }
    .main-content .list .list-img img {
        height: 250px; width: 94%; 
    }
    .main-content .list .list-top .edit .edit_txt{
        font-weight: 600; font-size: 16px; 
    }
    .carousel-inner {
        position: relative;
        top: 100px;
    }
}
/* 콜백 리스트 없을 시 */
.main-content .none {
    height: 367px; box-shadow: 16px 13px 23px #e8e8e8;
}
.main-content .none .no-list {
    height: 75%; text-align: center; padding: 48px;
}
.no-list p {
    font-weight: 500; font-size: 12px; line-height: 20px; text-align: center; letter-spacing: -0.05em; color: var(--color-light-icon)
}
.list-img {
    padding: 0px 15px; height: 164px;
    
}
.list-img .active {
    width: 100%; height: 100%;  border-radius: 16px;
} 
.list-img img,
.list-img .img-box {
    width: 100%; height: 100%; border-radius: 16px;  margin-top: 5px;
}

.list .list-info,
.main .none-content .list-info  {
    width: 90%; margin: auto; font-weight: 400; margin: 0px 10px;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: -0.05em;
    color: var(--color-dark-font); 
}

.list .list-info{
    position: relative; 
    top: 26px; word-break:break-all;
}
.list .list-info p {
    padding-left: 6px;  width: auto;
}
.list .list-showMore {
    color: #8C969F;
}
@media only screen and (min-width : 830px) {
    .list .list-info{
        position: relative; padding-left: 17px; top: 120px; margin: 0px 10px;
       letter-spacing: 0px; height: auto; 
    }
    .list .list-info p {
        font-size: 16px; 
    }
    .main-content .none {
        height: 560px; box-shadow: 16px 13px 23px #e8e8e8;
    }
    .main-content .none .no-list {
        height: 75%; text-align: center; padding: 100px;
    }
    .no-list p {
        font-weight: 600; font-size: 16px; line-height: 20px; text-align: center; letter-spacing: -0.005em; color: var(--color-light-icon)
    }
    .none .btn-wrapper label{
        height: 55px; line-height: 25px; font-size: 18px; border: 1px solid red; position: relative; top: -50px;
    }
}

/* loading */
.main .none-content,
.main .none-content .background {
    height: 100%;
}
.none-content .background {
    padding-bottom: 80px;
}
.main .none-content .list {
    height: 75vh;
}
.main .none-content .user-type {
    align-items: center;
}
.main .none-content .user-type div {
    background-color: var(--color-loading);
}
.main .none-content .user-type div:first-child {
    width: 32px; height: 32px; border-radius: 50%; 
}
.main .none-content .user-type div:nth-child(2) {
    width: 114px; height: 20px; margin: 0px 76px 0px 12px; left: 80px; top: 118px; 
}
.main .none-content .user-type div:last-child {
    width: 58px; height: 32px;  left: 270px; top: 112px; border-radius: 16px;
}

.main .none-content .list-top {
    display: flex; height: 10%; padding : 15px; align-items: center;
}
.main .none-content .list-top div {
    height: 20px; 
}
.main .none-content .list-top .circle {
    width: 20px; border-radius: 50%; background-color: var(--color-loading); margin-right: 2px;
}
.main .none-content .list-top .square {
    width: 43px;background-color: var(--color-loading); margin-right: 10px;
}
.main .none-content .list-top .square:last-child{
    margin-inline-start: auto; margin-right: 0px;
}
.main .none-content .img-box {
    background-color: var(--color-loading); 
}
.main .none-content .img-carousel {
    width: 36px; height: 2px; display: flex;
    margin: 16px 0; margin-left: auto; margin-right: auto;
}
.main .none-content .img-carousel div {
    width: 4px; border-radius: 50%;  height: 100%; background-color:var(--color-loading); margin-right: 2px;
}
.main .none-content .img-carousel div:first-child {
    width: 12px; border-radius: 10px; background-color:  var(--color-black);;
}

.main .none-content .list-info {
     height: 20%; margin-left: auto; margin-right: auto; padding: 10px 0;
}
.main .none-content .list-info div{
    background-color: var(--color-loading); height: 14px; 
    margin-bottom: 7px;
}
.main .none-content .list-info div:nth-child(4) {
    width: 60%;
}
/* main popup 창 */

.main .popup {
    position: absolute; background-color: #70747C; width: 100%; border-radius: 12px; 
}
.main .popup .pop-txt {
    display: flex; width: 100%; color: #FFFFFF; padding: 10px;  font-style: normal; font-weight: 400; line-height: 25px; letter-spacing: -0.05em; font-size: 15px;
}  
@media only screen and (min-width : 830px) {

    .main .popup .pop-txt {
        font-weight: 500; line-height: 25px; letter-spacing: -0.005em; font-size: 18px;
    }
}   
@media only screen and (min-width : 830px) {

    .main-content .list .btn-wrapper {
        margin-left: auto;
        margin-right: auto;
        padding-top: 100px;
    }
    .main-content .list .btn-wrapper label {
        height: 50px; line-height: 25px; font-size: 18px;
    }
    }
    
`
const CAROUSEL = styled.div `
   
.carousel-indicators  {
    top: 80%; text-align: center;  display: inherit; position: relative;
}
    .carousel-item button{
        color : #D8D8D8;
    }
    .carousel-indicators button {
        height: 4px; border: none; margin-right: 3px; width:1px; padding:3px; border-radius:50%;
   }
   .carousel-indicators .active {
        height: 4px;  background : ${props => props.color}; width:14px; paddin:0px; border-radius:100px;
   }
   .on_edit {
        background-color: red;
    }   

`
