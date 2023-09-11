/* eslint-disable */
import React from "react";
import { Link } from "react-router-dom";

// svg files
import Back from '../public/svg/Vector.svg'
import Logo from '../public/svg/main_logo.svg'
import Mypage from '../public/svg/person_a.svg'
import Reload from '../public/svg/reload.svg'
import styled from "styled-components";

export default function Top(prop) {

    const theme_color = prop.theme;
    const logo_icon = prop.logo;
    const setting_icon = prop.icon;
    const mypage_icon = prop.mypage;
    const title_txt = prop.title;
    const back_btn = prop.back;
    const back_color = prop.bgColor;
    const onClick = prop.onClick;
    const reload = prop.reload;
    
    return (
        <div className="top-bar" style={{"backgroundColor":back_color}}>
            <STYLE>
            <div className="top-nav">
                {
                back_btn ?
                <a href="javascript:window.history.back();" className="back"><img src={Back} alt="back_btn"/></a>
                :
                null
                }
                {
                logo_icon ?
                <div className="logo"><img src={Logo} /></div>
                :
                null}
                {title_txt ?
                <p className="txt">{title_txt}</p>
                :null
                }
                {
                setting_icon ?
                // <Link to='/' className="setting"><img src={theme_color.setting} /></Link>
                <div  className="setting" onClick={onClick}><img src={theme_color.setting} /></div>
                :
                null
                }
                {
                mypage_icon ?
                <Link to='/mypage' className="mypage"><img src={Mypage}/></Link>
                :
                null
                }
                {reload ?
                <div onClick={onClick}><img src={Reload} className="reload"/></div>
                :
                null}
                
            </div>
            </STYLE>
        </div>
    )
}

const STYLE = styled.div`
    .reload {
        width : 20px;
        margin-right : 10px;
    }
`