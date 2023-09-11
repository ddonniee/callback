import React from "react";
import { Link } from "react-router-dom";
import styled
 from "styled-components";
export default function Button(props) {

    const {txt, color, link, onSubmit, inactive, id} = props;

    return (
        <BUTTON>
        <div className="btn-wrapper" >
            {link!==undefined
            ?
            <>
            <input type="button" name="send-btn" style={{"display":"none"}}  disabled={inactive} ></input>
            <label htmlFor="send-btn" ><Link to={{
                pathname: link,
            }} 
            className="msg-btn" style={{"backgroundColor":color}} onClick={(e)=>onSubmit(e)}>{txt}</Link></label>
            </>
            :
            <>
            <input type="button" name="send-btn" style={{"display":"none"}}  disabled={inactive} ></input>
            <label id={id} htmlFor="send-btn" className="msg-btn" style={{"backgroundColor":color,"width":"100%"}} onClick={(e)=>onSubmit(e)}>
                {txt}
            </label></>}
        </div>
        </BUTTON>
    )
}

const BUTTON= styled.div`
.btn-wrapper {
    text-align: center; position: relative;
    top: 17px;
}
 .msg-btn {
    width: 90%; text-align: center; margin: auto; border-radius: 8px; color: white; font-weight: 500; font-size: 14px; line-height: 23px;
    padding: 9px 0px; background-color: var(--color-blue-grey); height: 42px; margin-bottom: 16px; display: inline-block; text-decoration: none;
}
 .send-btn {
    margin-bottom: 10px;
}
`