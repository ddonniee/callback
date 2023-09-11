/* eslint-disable */
import './App.css';
import './public/css/common.css'
import './public/css/style.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useEffect, useState, useLayoutEffect, createContext } from 'react';
// components
import Login from './view/Login';
import Main from './view/Main';
import CreateMSG from './component/CreateMSG';
import MyPage from './view/MyPage';
import Empty from './view/Empty';
import Terms from './view/Terms';
import Payment from './view/Payment'
import Log from './view/Log';
import Paid from './view/Paid';
import Credit from './view/Credit';
// 전역변수
import * as config from './config'
// svg files
import BANNER_BLUE from '../src/public/svg/banner_blue.svg'
import BANNER_RED from '../src/public/svg/banner_red.svg'
import AUTOSEND_ACTIVE from '../src/public/svg/autosend_on.svg'
import AUTOSEND_INACTIVE from '../src/public/svg/autosend_off.svg'
import CANCEL_BLUE from '../src/public/svg/cancel_blue.svg'
import CANCEL_RED from '../src/public/svg/cancel_red.svg'
import CHECK_BLUE from '../src/public/svg/check_blue.svg'
import CHECK_RED from '../src/public/svg/check_red.svg'
import REC_BLUE from '../src/public/svg/rec_blue.svg'
import REC_RED from '../src/public/svg/rec_red.svg'
import SETTING_BLUE from '../src/public/svg/setting_blue.svg'
import SETTING_RED from '../src/public/svg/setting_red.svg'
import Bookmark from '../src/public/svg/bookmark.svg'
import Book_Default from '../src/public/svg/book_default.svg'
import Edit_BLUE from '../src/public/svg/edit.svg'
import Edit_RED from '../src/public/svg/redit.svg'
import Issue_BLUE from '../src/public/svg/create_card.svg';
import Issue_RED from '../src/public/svg/rissue.svg';
import BAdd from '../src/public/svg/add_blue.svg'
import RAdd from '../src/public/svg/add_red.svg'

export const AppContext = createContext();
export const MemberContext = createContext();

function App() {
  // native에서 받아온 user id로 api에서 가져오는 user 정보
  const [auth, setAuth] = useState({
    id:0,
    status:0,
    color:'',
    email : null,
    phone:null,
    expire:null,
    service:null
  });
  const [token, setToken] = useState(undefined); 
  const [user, setUser] = useState();
  const [tokenchk, setTokenChk] = useState("N");
  const [theme, setTheme] = useState({
    bgColor : '',
    btnColor : '',
    btnBg : '',
    inactive : '',
    default:'#E8E8E8',                                                                                                                                                                                             
    setting : SETTING_RED,
    cancel : '',
    banner : BANNER_RED,
    auto_on : AUTOSEND_ACTIVE,
    auto_off:AUTOSEND_INACTIVE, 
    book_on : Bookmark,
    book_off: Book_Default,
    checked : {},
    recMsg : {},
    edit:'',
    empty:'',
    float:''
  })
  const [value,setValue] = useState({
    user : 0,
    token : null,
  })
  const [memberValue, setMemberValue] = useState({
    leftDays : -1,
    isMember : false,
  })
  useLayoutEffect(()=>{
    const temp_token = getTokenFromPhone();
    setToken(temp_token)
  },[])
  useLayoutEffect(()=>{
    let tempInfo = getUserIdFromPhone();
    setUser(tempInfo);
    setValue({
      user:tempInfo,
      token:token
    })
  },[token])
  
  function getUserIdFromPhone() {
    return window.Android.GetUserID();
  }                         
  function getUserColor() {
    return window.Android.GetMainColor()
  }
  function getTokenFromPhone() {      
    let chk = window.Android.GetAccessToken();
    if (chk.length > 10) {
      setToken(window.Android.GetAccessToken())
      setTokenChk("Y")
      return chk
    } else {
      setTokenChk("N")
      return undefined
    }
  }
  /**
   * 함수 작성자 : 이은정
   * 함수명 : changeMainColor
   * 기능 : 콜백 테마 색상 변경
   * @param {string} data // 네이티브앱에서 받아온 16비트 색상값으로 어플 기본 색상 및 아이콘 색상 적용 
   *                      // 현재는 red - #E95548, blue - #3182F7만 설정돼있음
   */
  function changeMainColor(data) {
    if(data=='#E95548') {
      setTheme({
        ...theme,
        bgColor : '#F8F8F8',
        btnBg : '#FFF3F3',
        btnColor : '#E95548',
        inactive : '#EDACAC',
        setting : SETTING_RED,
        cancel : CANCEL_RED,
        banner : BANNER_RED,
        checked : CHECK_RED,
        recMsg : REC_RED,
        edit:Edit_RED,
        empty:Issue_RED,
        float: RAdd
      })
    }
    if(data=='#3182F7') {
      setTheme({
        ...theme,
        bgColor : '#E9F3FD',
        btnBg : '#E9F3FD',
        btnColor : '#3182F7',
        inactive : '#ABC4E7',
        setting : SETTING_BLUE,
        cancel : CANCEL_BLUE,
        banner : BANNER_BLUE,
        checked : CHECK_BLUE,
        recMsg : REC_BLUE,
        edit:Edit_BLUE,
        empty:Issue_BLUE,
        float: BAdd
      })
    } // 
  }
  // tokenchk로 token값 확인되면 user id로 사용자 정보조회
  // api에서 받아온 색상값으로 changeMainColor에 매개변수로 넘겨서 어플 전체 색상 적용
  useEffect(()=>{
    if (token !== undefined) { 
      fetch(config.URL_ADDRESS+config.SERACH_USER+user, {
        mode: 'cors',
        headers: {
          'Content-Type':'application/json',
          'Accept':'application / json',
          'Access-Control-Allow-Origin':'*',
          'Authorization': 'Bearer ' + token,
        }
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        let tempColor = getUserColor();
        if(data.length!==0) {
          setAuth({
            id:data[0].user_id,
            status: data[0].status,
            color:tempColor,
            email:data[0].email,
            phone:data[0].phone,
            expire:data[0].exp_date,
            service:data[0].service
          })
          changeMainColor(tempColor);
        }
      })
      .catch((err)=>
        console.log(err)
      )
    }
    },[tokenchk])
  
    // 사용자정보로 유효기간 조회하여 멤버십여부와 남은 이용기간 전역으로 관리 
    useEffect(()=>{
      let td = new Date();
      let ed = new Date(auth.expire);
      // 결제 시간으로 만료시 하기와 같이
      let dateDiff = Math.ceil((td.getTime()-ed.getTime()))/(1000*3600*24)
      dateDiff = Math.floor(-dateDiff);
      // 결제일 자정 회원권 만료
      // let dateDiff = Math.ceil((td.getDate()-ed.getDate()))
      // dateDiff = Math.floor(-dateDiff);
      if(dateDiff>0) {
        setMemberValue({
          ...memberValue,
          leftDays: dateDiff,
          isMember: true
        })
      }
    },[auth])

  console.log(token,'nzom')
  return (
    <AppContext.Provider value={value}>
      <MemberContext.Provider value={memberValue}>
        <BrowserRouter>
        <div className="App">
          <div className='content'>
          {
              theme.bgColor===''?
            <Empty theme={theme}/>
            :
            <Routes>
          
              {/* token 값 확인안될시 loading page 보여주기 */}
              {token == undefined
              ?
              <Route path="/empty" element={<Empty/>}></Route>
              :
              <Route path="/" element={<Main theme={theme} auth={auth}/>}></Route>
              }
              <Route path="/create" element={<CreateMSG theme={theme} />}></Route>
              <Route path="/create/:id/:id2" element={<CreateMSG theme={theme} />}></Route>
              <Route path="/mypage" element={<MyPage theme={theme} />}></Route>
              <Route path="/empty" element={<Empty/>}></Route>
              <Route path="/account" element={<Login email={auth.email} theme={theme} isLogin={true} phone={auth.phone}/>}></Route>
              <Route path="/terms" element={<Terms isTerms={true}/>}></Route>
              <Route path="/policy" element={<Terms isTerms={false}/>}></Route>
              <Route path="/log" element={<Log color={auth.color} isSelected={true} />}></Route>
              <Route path="/payment" element={<Payment theme={theme} email={auth.email}/>}></Route>
              <Route path="/credit/:id" element={<Credit theme={theme} email={auth.email}/>}></Route>
              <Route path="/done/:id" element={<Paid theme={theme}/>}></Route>
          </Routes>
          }
          </div>
        </div> 
        </BrowserRouter>
      </MemberContext.Provider>
    </AppContext.Provider>
  );
}
export default App;
  
