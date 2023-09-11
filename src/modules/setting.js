import { Action } from "history";

const ALL = 'ALL';
const TODAY = 'TODAY';
const MONTH = 'MONTH';
const MONTHES = 'MONTHES'
const MANUAL = 'MANUAL';

export const all = () => ({ type: ALL});
export const today = () => ({ type: TODAY });
export const month = () => ({ type: MONTH });
export const monthes = () => ({ type: MONTHES });
export const manual = () => ({ type: MANUAL });

const dt = new Date();
const initialState = {
    monthName = (dt.getMonth()+1),
    dayName = (dt.getDate())
}
export default function setting (state=initialState, ation) {
    switch (action.type) {
        case All :
            return (
                state({
                    monthName : '',
                    dayName : ''
                })
            )
        case TODAY :
            return (
                state({
                    monthName : dt.getMonth()+1,
                    dayName : dt.getDate()
                })
            )
        case MONTH :
            return (
                state({
                    monthName : dt.getMonth(),
                    dayName : dt.getDate()
                })
            )
        case MONTHES :
            return (
                state({
                    monthName : dt.getMonth()-2,
                    dayName : dt.getDate()
                })
            )
       
    }
}