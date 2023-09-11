import React, {useEffect, useState} from "react";
import { confirmAlert } from 'react-confirm-alert';

const useConfirm=(alertDetail,close)=> {

    const options=alertDetail;

    const onSubmitAction=()=>{
      options.action();
    }
     function temp(){
      confirmAlert({
        title: options.title,
        message: options.message,   
        buttons: [
          options.isChoose && {
                label: "취소",
                style:{position:'relative', left:'-20px',color:'#8C969F !important'},
                onClick: () =>close
            },
            options.isChoose && {
            label: "확인",
            style:{position:'relative', left:'-10px',color:options.color},
            id:options.buttonId,
            onClick: (e) => onSubmitAction(),
            },
            !options.isChoose && {
              label: "확인",
              style:{position:'relative', left:'-20px',color:options.color},
              id:options.buttonId,
              onClick: (e) =>onSubmitAction(),
              }
        ],
        overlayClassName: options.overlayClassName
      })
     }
   
     useEffect(()=>{
      if(options.title) {
        temp()
      }
    },[options])

  
    return [temp];
}

export default useConfirm;
