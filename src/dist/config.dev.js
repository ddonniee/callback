"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RETURN_PAYMENT = exports.SEARCH_ONLINE = exports.SEARCH_PAYMENT = exports.CANCEL_PAYMENT = exports.MOBILE_PAYMENT = exports.WEB_PAYMENT = exports.PAYMENT_URL = exports.PAYMENT_KEY = exports.URL_ADDRESS = exports.ADD_LOG = exports.SEARCH_LOG = exports.DELETE_CARD = exports.DELETE_BOOKMARK_LIST = exports.UPDATE_BOOKMARK_LIST = exports.DELETE_AUTO_LIST = exports.UPDATE_AUTO_LIST = exports.UPDATE_CARD = exports.ADD_CARD = exports.LAST_DATE = exports.BOOKMARK_LIST = exports.AUTO_LIST = exports.SEARCH_CALLBACK_LIST = exports.LENGHT_CALLBACK_LIST = exports.DELETE_PROFILE = exports.UPDATE_PROFILE = exports.UPDAET_USER = exports.DELETE_USER = exports.ADD_USER = exports.SERACH_USER = exports.ALL_USERS = exports.EMAIL_CHECK = exports.AUTH_MAIL = void 0;
// Login
var AUTH_MAIL = '/api/user/mail'; //  User

exports.AUTH_MAIL = AUTH_MAIL;
var EMAIL_CHECK = '/api/user/users';
exports.EMAIL_CHECK = EMAIL_CHECK;
var ALL_USERS = '/api/user/list';
exports.ALL_USERS = ALL_USERS;
var SERACH_USER = '/api/user/';
exports.SERACH_USER = SERACH_USER;
var ADD_USER = '/api/user/singUp';
exports.ADD_USER = ADD_USER;
var DELETE_USER = '/api/user/delete';
exports.DELETE_USER = DELETE_USER;
var UPDAET_USER = '/api/user/update';
exports.UPDAET_USER = UPDAET_USER;
var UPDATE_PROFILE = '/api/user/profile';
exports.UPDATE_PROFILE = UPDATE_PROFILE;
var DELETE_PROFILE = '/api/user/profileDel'; // Card

exports.DELETE_PROFILE = DELETE_PROFILE;
var LENGHT_CALLBACK_LIST = '/api/card/listCnt/';
exports.LENGHT_CALLBACK_LIST = LENGHT_CALLBACK_LIST;
var SEARCH_CALLBACK_LIST = '/api/card/list';
exports.SEARCH_CALLBACK_LIST = SEARCH_CALLBACK_LIST;
var AUTO_LIST = '/api/card/auto/';
exports.AUTO_LIST = AUTO_LIST;
var BOOKMARK_LIST = '/api/bookmark/';
exports.BOOKMARK_LIST = BOOKMARK_LIST;
var LAST_DATE = '/api/card/last/';
exports.LAST_DATE = LAST_DATE;
var ADD_CARD = '/api/card/add';
exports.ADD_CARD = ADD_CARD;
var UPDATE_CARD = '/api/card/update/';
exports.UPDATE_CARD = UPDATE_CARD;
var UPDATE_AUTO_LIST = '/api/card/autoUdt/';
exports.UPDATE_AUTO_LIST = UPDATE_AUTO_LIST;
var DELETE_AUTO_LIST = '/api/card/autoDel/';
exports.DELETE_AUTO_LIST = DELETE_AUTO_LIST;
var UPDATE_BOOKMARK_LIST = '/api/card/bookmarkUdt/';
exports.UPDATE_BOOKMARK_LIST = UPDATE_BOOKMARK_LIST;
var DELETE_BOOKMARK_LIST = '/api/card/bookmarkDel/';
exports.DELETE_BOOKMARK_LIST = DELETE_BOOKMARK_LIST;
var DELETE_CARD = '/api/card/delete/'; // Log 

exports.DELETE_CARD = DELETE_CARD;
var SEARCH_LOG = '/api/log/list';
exports.SEARCH_LOG = SEARCH_LOG;
var ADD_LOG = '/api/log/add'; // export const URL_ADDRESS = 'http://api.adpotinc.com'
// export const URL_ADDRESS = 'http://mtsapi.anypot.co.kr'

exports.ADD_LOG = ADD_LOG;
var URL_ADDRESS = 'http://192.168.0.78:3000'; // export const URL_ADDRESS='http://localhost:3003';
// PG 도메인

exports.URL_ADDRESS = URL_ADDRESS;
var PAYMENT_KEY = 'http://192.168.0.78:3000/api/user/payment';
exports.PAYMENT_KEY = PAYMENT_KEY;
var PAYMENT_URL = 'https://dev-epay.kovanpay.com'; // export const PAYMENT_URL='https://epay.kovanpay.com';

exports.PAYMENT_URL = PAYMENT_URL;
var WEB_PAYMENT = '/paypage/common/miainFrame.pay';
exports.WEB_PAYMENT = WEB_PAYMENT;
var MOBILE_PAYMENT = '/mobilepage/common/mainFrame.pay';
exports.MOBILE_PAYMENT = MOBILE_PAYMENT;
var CANCEL_PAYMENT = '/webpay/cancel.pay';
exports.CANCEL_PAYMENT = CANCEL_PAYMENT;
var SEARCH_PAYMENT = '/webpay/getTransInfo.pay';
exports.SEARCH_PAYMENT = SEARCH_PAYMENT;
var SEARCH_ONLINE = 'https://ema.kovanpay.com/Trade/CreditCard/CardTidPop.out';
exports.SEARCH_ONLINE = SEARCH_ONLINE;
var RETURN_PAYMENT = 'http://192.168.0.78:3000/api/user/paymentrt';
exports.RETURN_PAYMENT = RETURN_PAYMENT;