import Taro from '@tarojs/taro'

import api from '@utils/api'
import { MODIFY_BUY_LIST_STATUS } from '@constants/buy'


export const buySubmit = ({ contact }) => {
    return (dispatch, getState) => {
        const { buyList } = getState()?.buy
        api.post('/buy',{contact,buyList}).then(res=>{
            const {status,msg,data,error} = res
            if(!status) Taro.showToast({title:msg,icon:"none"})
            const payload = {...data,contact}
            dispatch({type:MODIFY_BUY_LIST_STATUS,payload})
            
        })
    }
}