:pushpin: `npm module 설치`
===
npm install

:pushpin: `컴포넌트 사용`
===
### Hybrid app으로 google android 번호 있을때만 실행 가능


- Button 컴포넌트 옵션값

| 인자명 | 타입 | 설명 |
| --- | --- | --- |
| txt | string | 버튼에 표시되는 텍스트 |
| color | string | 버튼 전체 컬러, css styling 가능한 인자값 |
| link | 웹 주소 | 버튼 클릭시 연결되는 전체 주소값 |
| onSubmit | Event handler | 버튼 클릭 이벤트 처리 함수 전달 |
| inactive | boolean | 버튼 활성화 여부, true 일시 비화성화 |

- CreateMSG 옵션값

| 인자명 | 타입 | 설명 | 입력 값 예시 |
| --- | --- | --- | --- |
| theme | object | native에서 받아온 색상값으로 App단에서 설정한 테마 값 객체 | bgColor : '#E9F3FD', btnBg : '#E9F3FD', btnColo : '#3182F7', inactive : '#ABC4E7', setting : SETTING_BLUE, cancel : CANCEL_BLUE, banner : BANNER_BLUE, checked : CHECK_BLUE, recMsg :  REC_BLUE |

- FloatBtn 옵션값

| 인자명 | 타입 | 설명 |
| --- | --- | --- |
| name | string | html 요소 id 로 전달됨 / (label 요소 존재하여 필수) |
| icon | image file or path | 버튼 내 표시되는 아이콘 |
| onScrollToTop | Event Handler Function | 클릭시 이벤트 처리 함수 | 

- Popup components 옵션값

| 인자명 | 타입 | 설명 | 입력 인자값 예시 |
| --- | --- | --- | --- |
| txt | string | 클릭 된 태그 클래스명 | 'delete |
| toggle | boolean | popup 창 오픈 여부 | true |
| msg | string | 콜백문자 삭제시 멘트 전달 | "가 완료되었습니다." |

- SettingModal 옵션값

| 인자명 | 타입 | 설명 | 입력 인자값 예시 |
| --- | --- | --- | --- |
| color |  #000000 or 'white' | 텍스트 /테두리 색상, css styling 가능한 인자값 |
| onClick | Event Handler Function | 클릭시 이벤트 처리 함수 | 
| setSearchFilter | setState(date,sort,start,end) | 검색 옵션값 전달 | SettingModal의 '발송구분' 하위에 오는 버튼의 클릭시 전달되는 인자 ('전체','자동','수동','선택') |
| title |  string | setting modal창 title | '조회기간 설정' |
| isDuration |  boolean | 발송기간 설정 값 보이기 | true or false |
| onChange |  function | 발송기간 선택후 직접입력시, date picker 값 전달받음 | setStartDate |
| onDelete | function | 프로필 이미지 기본 이미지로 변경, state에 저장된 img url 값 초기화 |  onDelete |
- Top 옵션값

| 인자명 | 타입 | 설명 | 입력 인자값 예시 |
| --- | --- | --- | --- |
| theme | Object | 테마별로 나뉘는 아이콘, color 값 객체로 전달 | bgColor : '#F8F8F8',btnBg : '#FFF3F3', btnColor : '#E95548', inactive : '#EDACAC', setting : SETTING_RED,(svg file) cancel : CANCEL_RED,(svg file) banner : BANNER_RED,(svg file) checked : CHECK_RED,(svg file) recMsg : REC_RED, (svg file)  | 
| logo | boolean |  main icon 표시 여부 | true |
| icon | boolean | setting tool icon 표시 여부 | true |
| mypage | boolean | mypage icon 표시 여부 | true |
| title | string | top bar 설명 텍스트 | '콜백리스트' |
| back | boolean | 뒤로가기 icon 표시 여부 | true |
| bgColor | string | top bar 배경 색상 | '#ffffff' |
| onClick | Event Handler Function | icon 클릭시 처리 함수 | getSettingPageFromNative, 네이티브 설정 페이지 연결 함수 |
| reload | boolean | 서버 데이터 호출 함수 | true | 

- Alert 모달 옵션 값

| 인자명 | 타입 | 설명 | 입력 인자값 예시 |
| --- | --- | --- | --- |
| title | string | 모달창 제목 | "인증메일 오류알림" | 
| message | string | 모달창 설명 | "정확한 이메일 주소를 입력해주세요." | 
| close | boolean | 모달창 닫힘 버튼 | true or false | 
| lists | 배열값 | 여러 항목 설명 | [{icon:Service, (svg file)title:"유료 서비스 신청 시",desc:"필수로 이메일 인증을 해야합니다."},{ icon:Phone, (svg file)title:"휴대폰 번호 변경 시",desc:"이메일인증으로 내 정보를 찾을 수 있습니다."}]|
| confirm | boolean | 확인/취소로 작업 진행 여부 | true or false | 
| onClick | function() | event handler | handleClickEvent | 
| color | string | confirm option의 확인 텍스트 컬러값 | #ffffff | 
| onClose | function() | 모달창 여닫는 state의 setState | setAlert | 

- Loader 로딩 상태 옵션 값

| 인자명 | 타입 | 설명 | 입력 인자값 예시 |
| ---| --- | --- | --- |
| isCenter | boolean | 로딩바 중앙 정렬 or 하단 정렬 | true or false |
| color | string | 로딩바 색상 | #ffffff or white |