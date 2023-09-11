/* eslint-disable */
import React from "react";
import { Fade } from "react-reveal";

export default function FloatBtn(props) {

     const name = props.name;
     const icon = props.icon;
     const onScrollToTop = props.onClick;
    return (
        <Fade>
            <div className="w-btn">
                <input type="button" style={{"display":"none"}} id={name}  />
                <label htmlFor={name}  >
                    <div className="btn-shape" onClick={(e)=>onScrollToTop(e)}>
                        <img src={icon} alt="scroll_to_top"/>
                    </div>
                </label>
            </div>
        </Fade>
    )
}