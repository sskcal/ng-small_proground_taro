import {
    MODIFY_USER_INFO,
    FEATCH_ORDERS,
    CLEAR_DATA,
    CLOSE_ORDER,
    SAVE_CODES,
    SET_REFUND_DATA,
} from "@constants/user";
import {InitialStateType} from './types/user/index'


const initialState: InitialStateType = {
    nickName: '',
    avatarUrl: '',
    gender: '',
    orders: {
        resultList: [],
        totalPage: 0,
        count: 0,
        current: 0,
        keyWord: '',
        type: '',
    },
    codes: [],
    refundData: [],
}

export default (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case MODIFY_USER_INFO:
            return {
                ...state,
                ...payload
            }
        case FEATCH_ORDERS:
            const newResultList = state.orders.type.toString() === payload.type.toString()
                ?
                [...state.orders.resultList, ...payload.resultList]
                :
                payload.resultList
            return {
                ...state,
                orders: {
                    // payload = {resultList,count,totalPage,current,type}
                    ...payload,
                    resultList: newResultList
                }
            }
        case CLEAR_DATA:
            return {
                ...state,
                orders: initialState.orders
            }
        case CLOSE_ORDER:
            return {
                ...state,
                orders: payload
            }
        case SAVE_CODES:
            return {
                ...state,
                codes: payload
            }
        case SET_REFUND_DATA:
            return {
                ...state,
                refundData: payload
            }
        default:
            return state
    }
}