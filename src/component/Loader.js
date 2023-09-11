import {memo, useState} from 'react';
import ReactLoading from 'react-loading'
import styled from 'styled-components';

const LoaderWrap = styled.div `
    width: 30%;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    position:absolute;
    top: ${props=>props.position};
    left:50%;
    transform: translate(-50%, -50%);  
    margin:0px;       
    padding: 0px; 
`

function Loader (props){

    const {isCenter, color} = props;

    return (
        <LoaderWrap position={isCenter ? '50%':'99%'} >
            <ReactLoading type='spin' color={color} />
        </LoaderWrap>
    )
}

export default memo(Loader) 