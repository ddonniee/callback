// Login
export const AUTH_MAIL = '/api/user/mail'
//  User
export const EMAIL_CHECK = '/api/user/users';
export const ALL_USERS = '/api/user/list'
export const SERACH_USER = '/api/user/';
export const ADD_USER = '/api/user/singUp';
export const DELETE_USER = '/api/user/delete';
export const UPDAET_USER = '/api/user/update';
export const UPDATE_PROFILE = '/api/user/profile';
export const DELETE_PROFILE = '/api/user/profileDel';
// Card
export const LENGHT_CALLBACK_LIST = '/api/card/listCnt/'
export const SEARCH_CALLBACK_LIST = '/api/card/list';
export const AUTO_LIST = '/api/card/auto/';
export const BOOKMARK_LIST = '/api/bookmark/'
export const LAST_DATE = '/api/card/last/'
export const ADD_CARD = '/api/card/add'
export const UPDATE_CARD = '/api/card/update/';
export const UPDATE_AUTO_LIST = '/api/card/autoUdt/';
export const DELETE_AUTO_LIST = '/api/card/autoDel/';
export const UPDATE_BOOKMARK_LIST = '/api/card/bookmarkUdt/';
export const DELETE_BOOKMARK_LIST = '/api/card/bookmarkDel/';
export const DELETE_CARD = '/api/card/delete/';

// Log 
export const SEARCH_LOG = '/api/log/list'
export const ADD_LOG = '/api/log/add'

// export const URL_ADDRESS = 'http://api.adpotinc.com'
export const URL_ADDRESS = 'http://mtsapi.anypot.co.kr'
// export const URL_ADDRESS = 'http://192.168.0.78:3000'
// export const URL_ADDRESS='http://localhost:3003';
// PG 도메인
export const PAYMENT_KEY='https://mtsapi.anypot.co.kr/api/user/payment';
// export const PAYMENT_KEY='http://192.168.0.78:3000/api/user/payment';
// export const PAYMENT_URL='https://dev-epay.kovanpay.com';
export const PAYMENT_URL='https://epay.kovanpay.com';
export const WEB_PAYMENT='/paypage/common/miainFrame.pay';
export const MOBILE_PAYMENT='/mobilepage/common/mainFrame.pay';
export const CANCEL_PAYMENT='/webpay/cancel.pay';
export const SEARCH_PAYMENT='/webpay/getTransInfo.pay';
export const SEARCH_ONLINE='https://ema.kovanpay.com/Trade/CreditCard/CardTidPop.out';
export const RETURN_PAYMENT = 'https://mtsapi.anypot.co.kr/api/user/paymentrt'
// export const RETURN_PAYMENT = 'http://192.168.0.78:3000/api/user/paymentrt'
