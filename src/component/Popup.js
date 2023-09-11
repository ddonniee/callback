/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Fade } from "react-reveal";
import styled from "styled-components";

export default function Popup(prop) {

    const txt = prop.txt;
    const toggle = prop.toggle;
    const msg = prop.msg;
    const height = prop.height;

    const [post, setPost] = useState({
        title : '',
        add : '로',
        del : '가',
        msg : msg
    });

    const [isValue, setIsValue] = useState(false)

   
    useEffect(()=>{
        if(txt=='auto_send') {
             setPost({
                 ...post,
                 title:'자동발송',
                 add:'이',
                 del:'이'
             })
        }
        if(txt=='bookmark'){
            setPost({
                ...post,
                title:'즐겨찾기',
                add:'로',
                del:'가'
            })
       }
       if(txt=='delete') {
           setPost({
                ...post,
                title:'콜백문자 삭제',
                add:'로',
                del:'가'
            })
       }
    },[])

    useEffect(()=>{
        post.title === '' 
        ?
        setIsValue(false)
        :
        setIsValue(true)   
    },[post])

    return (
        
        isValue && <Fade clear >

            <div className="popup" style={toggle!==undefined ? {"top":"50px"}:{"position":"fixed","top":"150px", "width":"90%","marginLeft":"5%"}}>
                <div className="pop-txt"><p>{post.title}</p>
                {
                toggle==true
                ?
                <p>{post.del} 해제되었습니다.</p>
                :
                toggle==false
                ?
                <p>{post.add} 설정되었습니다.</p>
                :
                toggle==undefined
                ?
                <p>{post.msg}</p>
                :
                null
                }</div>
                
            </div>
         </Fade>
    )
}

const STYLE = styled.div`
    .popup {

    }
`