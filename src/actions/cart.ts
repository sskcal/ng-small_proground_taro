import Taro from '@tarojs/taro'

import api from '@utils/api'
import { MODIFY_BUY_QUANTITY } from '@constants/buy'


/**
 * 把购物车的state给到buy的state
 * @param jumpFun 跳转的方法
 */
export const cartDataToBuy = (jumpFun)=>{
    return (dispatch,getState)=>{
        const {cart} = getState()
        const {buyList} = cart
        dispatch({type:MODIFY_BUY_QUANTITY,payload:buyList})
        jumpFun && jumpFun()
    }
}
