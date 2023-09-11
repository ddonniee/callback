import React, { useState, useEffect } from "react";
import { Fade } from "react-reveal";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from 'jquery';
import Close from '../public/svg/CloseIcon.svg'
import Cal from '../public/svg/cal.svg'
import Button from "./Button";

export default function SettingModal(props) {

    const {title, color, onClick, setSearchFilter,isDuration, onChange, onDelete} = props;
    
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date())

    const [sort, setSort] = useState(undefined);
    const [date, setDate] = useState(undefined);                                                                                                                                                                      

    $(function() {
        $('.react-datepicker__input-container >input').attr("disabled", true);
        $('.react-datepicker__day--selected').css("background-color", color);
    })

    return (
        <Modal color={color} isMove={ date==='직접입력' ? true : false}>
        <Fade clear>
            <div className="background">
            <div className="search_input" style={{backgroundColor:"white"}}>
                <div className="top">
                    <p className="title">{title}</p>
                    <div className="close" onClick={(e)=>onClick(false)}><img src={Close} alt="close_btn"/></div>
                </div>

                {
                    isDuration
                    ?
                    <div className="content">
                    <form>
                    <div className="w-duration">
                        <div className="sub_title">발송기간</div>
                        <div className="duration">
                            <input type="radio" id="duration_all" name="duration_setting" value="all" onClick={(e)=>setDate('전체')} hidden/>
                                <label htmlFor="duration_all" >전체</label>
                            <input type="radio" id="duration_today" name="duration_setting" value="today" onClick={(e)=>setDate('오늘')} hidden/>
                                <label htmlFor="duration_today">오늘</label>
                            <input type="radio" id="duration_month" name="duration_setting" value="month" onClick={(e)=>setDate('1개월')} hidden/>
                                <label htmlFor="duration_month">1개월</label>
                            <input type="radio" id="duration_months" name="duration_setting" value="months" onClick={(e)=>setDate('3개월')} hidden />
                                <label htmlFor="duration_months">3개월</label>
                            <input type="radio" id="duration_insert" name="duration_setting" value="insert" hidden onClick={(e)=>setDate('직접입력')}/>
                                <label htmlFor="duration_insert" >직접입력</label> 
                        </div>
                    </div>
                    {
                        date === '직접입력'
                        ?
                        <div className="w-date-range">
                        <div  className="date-range">
                            <img src={Cal} alt="calendar_icon"/>
                        <DatePicker 
                            className="date-picker"
                            selected={startDate}
                            maxDate={new Date()}
                            onChange={(d) => setStartDate(d)}
                            dateFormat="yyyy.MM.dd"
                            yearItemNumber={9}
                            fixedHeight={true}
                            />
                        
                        </div>
                        <p>-</p>
                        <div  className="date-range">
                            <img src={Cal} alt="calendar_icon"/>
                        <DatePicker 
                            className="date-picker"
                            selected={endDate}
                            maxDate={new Date()}
                            onChange={(d) => setEndDate(d)}
                            dateFormat="yyyy.MM.dd"
                            yearItemNumber={9}
                            fixedHeight={true}
                            />
                        </div>
                    </div>
                    :
                    null
                    }
                    <div className="category">
                        <div className="sub_title">발송구분</div>
                        <div className="mode">
                            <input type="radio" id="mode_all" name="mode_setting" value="all_" onClick={(e)=>setSort('전체')} hidden />
                                <label htmlFor="mode_all">전체</label>
                            <input type="radio" id="mode_auto" name="mode_setting" value="auto" onClick={(e)=>setSort('자동')} hidden />
                                <label htmlFor="mode_auto">자동</label>
                            <input type="radio" id="mode_manual" name="mode_setting" value="manual" onClick={(e)=>setSort('수동')} hidden />
                                <label htmlFor="mode_manual">수동</label>
                            <input type="radio" id="mode_insert" name="mode_setting" value="insert" onClick={(e)=>setSort('선택')} hidden />
                                <label htmlFor="mode_insert">선택</label>
                        </div>
                    </div>
                    
                    </form>
                    <Button txt="검색" color={color} onSubmit={(e)=>setSearchFilter(date,sort,startDate,endDate)} inactive={false} isLong={date=='직접입력' ? true:false}/>
                </div>
                :
                <div className="content">
                    <ul className="edit_profile">
                        <li onClick={onDelete}>기본 이미지로 변경</li>
                        <li><input type="file" accept="image/*" capture="user" style={{display:"none"}} id="load_camera"/>
                        <label htmlFor="load_camera">사진촬영</label>
                        </li>
                        <li ><input type="file" multiple={false} onChange={(e)=>{onChange(e)}} style={{display:"none"}} id="load_img"/>
                        <label htmlFor="load_img">사진 앨범에서 선택</label>
                        </li>
                    </ul>
                </div>
                }
            </div>
            </div>
        </Fade>
        </Modal>
    )
}

const Modal=styled.div`
    
    .background {
        position: fixed; top: 0; left: 0;  width: 100%; height: 100vh; background-color: rgba(0, 0, 0, 0.3); box-sizing:border-box; z-index: 1000;
    }
    .search_input{
        background : white;
        height : 400px;
        width : 100%;
        bottom : 0px;
        position : fixed;
        box-shadow: 0px -3px 30px rgba(0, 0, 0, 0.07);
        border-radius: 16px 16px 0px 0px;
        padding : 16px;
    }
    .content ul,
    .content li {
        list-style: none; padding: 0; margin: 0; 
    }
    .content ul {
        height: 100%;
    }
    .content ul li {
        height: 11.5%; display: flex;
        flex-direction: row;
        align-items: center;font-weight: 550;
        font-size: 15px;
        line-height: 24px;
        letter-spacing: -0.05em;
        font-feature-settings: 'pnum' on, 'lnum' on;
        color: #5D6067;
}
.content ul li:not(:last-child) {
    border-bottom: 1px solid #EFEFEF;;
}
    .top {
        display : flex;
        justify-content : space-between;
        height:20%;
    }
    .top .close {
        margin-top : auto;
        margin-bottom : auto;
    }
    .top .title {
        font-weight: 700;
        font-size: 18px;
        line-height: 30px;
        letter-spacing: -0.05em;
        font-feature-settings: 'pnum' on, 'lnum' on;
        color: #35394A;
    }
    .content {
        width : 100%;
        height : inherit;
    }
   
    .content .sub_title {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 500;
        font-size: 13px;
        line-height: 22px;
        letter-spacing: -0.05em;
        color: #5D6067; 
    }
    .duration,
    .mode {
        border : none;
        display : flex;
        
        padding : 5px 0;
    }
    .duration {
        justify-content : space-between;
    }
    .duration label{
         border : 1px solid #E8E8E8;
         width: 70px;
         height: 36px;
         border-radius: 100px;
         font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 31px;
        letter-spacing: -0.05em;
        text-align : center;
    }
   
    input[type="radio"]:checked + label {
        border : 1px solid ${props => props.color};
        color :  ${props => props.color};
    }
    .w-date-range {
        display : flex;
        border : none;
        justify-content : space-between;
        padding: 10px 0;
    }
    .date-range {
        display : flex;
        border : 1px solid #E8E8E8;
        margin-top:auto;
        margin-bottom:auto;
        border-radius: 8px;
        padding : 5px;
    }
    .date-range:first-child{
        margin-right : 5px;
    }
    .date-range:last-child{
        margin-left : 5px;
    }
    .date-range img {
        width : 20px;
        text-align : center;
        margin-left : 10px;
    }
    .date-range p {
        margin-top:auto;
        margin-bottom:auto;
    }
    .date-picker {
        border-radius: 8px;
        padding : 10px;
        width:45%
    }
    .date-range div  input {
        width: inherit;
        border : none;
    }
    .category {
        padding : 10px 0; margin-bottom : ${props=>props.isMove ? "0":"78px"}
    }
    .mode label {
        border : 1px solid #E8E8E8;
         width: 80px;
         height: 36px;
         border-radius: 100px;
         font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 30px;
        letter-spacing: -0.05em;
        text-align : center;
        margin-right : 5px;
    }
    div[aria-selected="true"] {
        background-color: ${props=>props.color}
    }
`