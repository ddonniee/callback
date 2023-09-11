import React, {useContext} from "react";
import $ from "jquery";
import { Link  } from "react-router-dom";
import Del from '../public/svg/del.svg'
import Modal from 'react-modal'
import { AppContext } from "../App";
/**
     * 컴포넌트명 : ModifyContent
     * 작성자 : 이은정
     * 편집하기 버튼 클릭시 카드 수정 혹은 삭제 선택할 수 있는 모달창
     * @param { ojbect } prop index, card_id props
     * @returns 모달창
     */
export default function ModifyContent(props) {
    const value = useContext(AppContext);
    const {idx, num, theme, onClick} = props;
    var div = document.getElementById(idx);
    var rect = div.getBoundingClientRect().top;

    rect += 30;
    rect += "px"
    $('.ReactModal__Content--after-open').css("top",rect)

    return (
            <Modal 
                isOpen={true} 
                ariaHideApp={false}
                style={{
                  content: {
                      top:rect,
                      border:'none',
                    }
                }}
            >
            <div className="on_edit" style={{
                fontSize:"14px",
            }}>
            <div>
                
                <Link to={{
                        pathname: '/create/'+value.user+'/'+num,
                    }} className="edit_btn">
                        <p>수정하기</p>
                        <img src={theme.edit}></img>
                </Link>
            </div>
                <div onClick={(e)=> onClick(2,e,idx,num)}>
                    <p> 삭제하기</p>
                    <img src={Del}></img> 
                </div>
            </div>
            </Modal>
    )
}