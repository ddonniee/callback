"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useConfirm;

var _react = _interopRequireWildcard(require("react"));

var _reactConfirmAlert = require("react-confirm-alert");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function useConfirm(props) {
  var title = props.title,
      message = props.message,
      classTtitle = props.classTtitle,
      onClickOutSide = props.onClickOutSide,
      onSubmit = props.onSubmit,
      isChoose = props.isChoose,
      color = props.color,
      buttonId = props.buttonId,
      overlayClassName = props.overlayClassName;
  console.log('들어완나요');
  (0, _reactConfirmAlert.confirmAlert)({
    title: title,
    message: message,
    onClickOutside: function onClickOutside() {
      onClickOutSide();
    },
    buttons: [// isChoose && {
    //         label: "취소",
    //         style:{position:'relative', left:'-20px',color:'#8C969F !important'},
    //         onClick: () => onSubmit()
    //     },
    {
      label: "확인",
      style: {
        position: 'relative',
        left: '-20px',
        color: color
      },
      id: buttonId,
      onClick: function onClick() {
        return onSubmit();
      }
    }],
    overlayClassName: overlayClassName
  });
}