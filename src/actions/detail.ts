import {GET_DETAIL} from '@constants/detail'
import api from '@utils/api'

export const getDetail = (_id)=>{
    return async (dispatch)=>{
        api.get(`/detail/${_id}`).then(res=>{
            const {status,data} = res
            status && dispatch({type:GET_DETAIL,payload:data})
        })
    }
}