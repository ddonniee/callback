/* eslint-disable */
import React, { useState } from "react";
import { Fade } from "react-reveal";
import styled
 from "styled-components";
// component
import Top from "../component/Top";

export default function Empty(props) {

    const dummy = props;
    const [data, setData] = useState(dummy);
    const [isBlink, setIsBlink] = useState(false)

    return (
        <Fade clear>
            <STYLE isBlink={isBlink}>
        <div className="main">
            <Top theme={data} logo={true} icon={true} mypage={true} title={false} back={false} />
            <div className="none-content" style={{"backgroundColor":"#F9F9F9"}}>
        
       
            <div className="background">

            <div className="user-type">
                <div></div>
                <div></div>
                <div></div>
            </div>

                    <div className="list">
                        <div className="list-top">
                            <div className="circle"></div>
                            <div className="square"></div>
                            <div className="circle"></div>
                            <div className="square"></div>
                            <div className="square"></div>
                         </div>
                
                
                        <div className="list-img">
                            <div className="img-box"></div>
                            
                        </div>

                        <div className="img-carousel">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className="list-info">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                         </div>
                
                        <div className="btn-box" style={{"backgroundColor":"#EFEFEF", "width":"90%"}}></div>
                
                    </div>

            </div>
       
       
            </div>

            
        </div>
        </STYLE>
        </Fade>
    )
}

const STYLE = styled.div`

@keyframes loading {
    0% {
      transform: translateX(0);
    }
    50%,
    100% {
      transform: translateX(460px);
    }
  }


white-space:pre-wrap;
/* main */
.main,
.main-content {
    height :fit-content;
    min-height: 100vh; 
}


.main-content > div > .user-type,
.main .none-content .user-type {
    background-color: white; margin: auto; width: 90%;border-radius: 20px; display: flex; position: relative; top: 15px; padding: 20px 25px; box-shadow: 16px 13px 23px #e8e8e8;
}

.main .none-content .user-type div:first-child,
.main .none-content .user-type div:last-child {
    flex-grow: 1; 
}

.main .none-content .user-type div:nth-child(2) {
    flex-grow: 8; padding-left: 10px; 
}



.none-content .list {
    width: 90%; background-color: white; margin: auto; position: relative; top: 50px; border-radius: 20px; box-shadow: 16px 13px 23px #e8e8e8; margin-bottom: 16px;
     overflow:unset; height:auto;
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
.main-content .list .list-img {
    
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
    width: 100%; height: 100%;border-radius: 16px;
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
.user-type div::before,
.list div div::before {
    content: ""; position: absolute; top: 0;  left: 0; width: 30px; height: 100%;
    background: linear-gradient(to right, #f2f2f2, #ddd, #f2f2f2);
    animation: loading 2s infinite linear;
}
.main .none-content .user-type div,
.list div div {
    background-color: var(--color-loading); position: relative; overflow: hidden;
}

.main .none-content .user-type div:first-child {
    width: 32px; height: 32px; border-radius: 50%; 
}
.main .none-content .user-type div:nth-child(2) {
    width: 114px; height: 20px; margin: 0px 76px 0px 12px; 
}
.main .none-content .user-type div:last-child {
    width: 58px; height: 32px; border-radius: 16px;
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