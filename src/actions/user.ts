import Taro from '@tarojs/taro'
import {MODIFY_USER_INFO} from '@constants/user'
import api from '@utils/api'
import {FEATCH_ORDERS,CLOSE_ORDER,SAVE_CODES,SET_REFUND_DATA} from '@constants/user'

const pageSize = PAGE_SIZE

// 修改用户基本信息
export const modifyUserInfo = ({nickName,gender,avatarUrl},setIsOpened?)=>{
    const genderDic = {"0":"保密","1":"男","2":"女"}
    return (dispatch)=>{
        api.put('/user',{nickName,gender:genderDic[gender] || '保密',avatarUrl}).then(res=>{
            const {status} = res
            if(status){
                dispatch({type:MODIFY_USER_INFO,payload:{nickName,gender,avatarUrl}})
                // 关闭登陆框
                setIsOpened && setIsOpened(false)
            }
        })
    }
}
/**
 * 获取用户订单数据
 * @param type 1-5 ["待支付"，"支付成功"]
 * @param keyWord 
 * @param current 

 * 
 */
export const featchOrders = ({type,keyWord,current=1,cb})=>{
    return (dispatch)=>{
        api.post('/user/orders',{type,keyWord,pageSize,current}).then(res=>{
            const {status,data,msg} = res;
            
            
            cb && cb(res)
            if(!status){
                return Taro.showToast({title:msg,icon:"none"})
            }
            
            // data = {resultList,count}
            dispatch({type:FEATCH_ORDERS,payload:{...data,type,current,totalPage:Math.ceil(data.count / pageSize)}})
        })
    }
}
/**
 * 关闭订单
 * 关闭后在订单列表剔除被关闭的订单
 * @param param0 
 */
export const closeOrder = ({orderId})=>{
    return (dispatch,getState)=>{
        const {orders} = (getState()).user
        api.post('/user/close_order',{orderId}).then(res=>{
            const {status,msg} = res;
            if(!status){
                return Taro.showToast({title:msg,icon:"none"})
            }
            dispatch({type:CLOSE_ORDER,payload:{...orders,resultList:orders.resultList.filter(x=>x._id !== orderId)}})
        })
        
    }
}
/**
 * 获取电子码
 * @param orderId 
 */
export const featchCodes = (orderId)=>{
    return (dispatch)=>{
        api.get('/user/codes/' + orderId).then(res => {
            const {status,msg,data} = res
            !status && Taro.showToast({title:msg,icon:'none'})
            dispatch({type:SAVE_CODES,payload:data})
        })
    }
}
// 设置退款数据
export const setRefundData = (refundData)=>{
    return (dispatch)=>{
        dispatch({type:SET_REFUND_DATA,payload:refundData})
    }
}

// 提交退款
export const submitRefund = ({refundData,refundReason,cb}) =>{
    return ()=>{
        api.post('/user/refund',{refundData,refundReason}).then(res=>{
            const {status,msg,data} = res
            if(!status) return Taro.showToast({title:msg,icon:'none'})
            cb && cb(res)
        })
    }
}

// 取消退款
export const cancelRefund = ({orderId,cb})=>{
    return ()=>{
        console.log(orderId);
        api.post('/user/cancel_refund',{orderId}).then(res=>{
            console.log('laile');
            
            cb && cb(res)
        }).catch(err=>{
            console.log(err);
            
        })
    }
}

// 获取退款详情
export const featchRefund = ({orderId,cb})=>{
    return ()=>{
        api.get('/user/featch_refund/'+orderId).then(res=>{
            cb && cb(res)
        })
    }
}