import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import BuyItem from './item/index'
import { get as getGlobalData } from '../../../../global_data'
import { useSelector, useDispatch } from 'react-redux'
import { featchCodes, setRefundData } from '@actions/user'
import { RefundDataType } from '../../../../reducers/types/user/index'
import { AtTextarea } from 'taro-ui'
import {submitRefund} from '@actions/user'
import './index.scss'

const findImg = getGlobalData("findImg")
export default () => {
    const [reasonText, setReasonText] = useState('')
    const dispatch = useDispatch()
    const router = useRouter()
    const [resultList, codes, refundDataState] = useSelector(state => [state?.user?.orders?.resultList || [], state.user.codes, state.user.refundData])
    const { orderId } = router.params
    const detailState = resultList.find(x => x._id === orderId)
    const [detail, setDetail] = useState(detailState)
    const { children } = detail
    const totalFeeCalc = refundDataState.map(x => x.discount * x.refundQuantity)
    // 计算退款金额
    const totalFee = totalFeeCalc.length ?
        totalFeeCalc.reduce((a, b) => a + b).toFixed(2)
        : 0
    
    
    const confirmRefund = () => {
        if(!reasonText) return Taro.showToast({title:'请填写退款原因',icon:'none'})
        if(totalFee === 0) return Taro.showToast({title:'退款金额为0，不能执行退款',icon:'none'})
        // {order,price,refundQuantity}[]
        const submitData = refundDataState.map(x=>({order:x.order,price:x.price,refundQuantity:x.refundQuantity}))
        dispatch(submitRefund({refundData:{orderId,list:submitData},refundReason:reasonText,cb:function(res){
            const {status,msg} = res
            if(!status) return Taro.showToast({title:msg,icon:'none'})
            if(status){
                Taro.showToast({title:"申请成功，待审核！",icon:'none'})
                Taro.switchTab({
                    url:'/pages/user/index',
                    success:()=>{
                        Taro.navigateTo({
                            url:'/pages/user/orders/index?type=2',
                            success:()=>{
                                Taro.showToast({title:'审核成功后，资金原路返还',icon:'none',duration:4000})
                            }
                        })
                    }
                })
            }
            
        }}))
        
    }


    useEffect(() => {
        Taro.setNavigationBarTitle({
            title: "我的"
        })
        dispatch(featchCodes(orderId))
    }, [])

    useEffect(() => {
        // 格式化退款数据
        const refundData: RefundDataType = codes.map(item => {
            const { order, price, productInfo, quantity, useQuantity, refundQuantity } = item;
            let discount, buyQuantity
            resultList.find(x => x.children.find(y => y.prices.find(z => {
                if (z.priceId === price) {
                    discount = z.discount
                    buyQuantity = z.buyQuantity
                }
            })))

            return { order, price, productInfo, quantity, useQuantity, refundQuantity: quantity - useQuantity - refundQuantity, discount, buyQuantity }
        })
        // 保存退款数据
        dispatch(setRefundData(refundData))
    }, [codes])
    return (
        <View className="body">
            <View className="title">请选择退款宝贝</View>

            <View className="buy_list">

                {
                    children?.map(item => {
                        return item.prices?.map(price => {
                            const buyQuantity = price.buyQuantity ? price.buyQuantity : 1
                            const props = { ...price, ...item, buyQuantity, indexImg: findImg(item.indexImg) }
                            return <BuyItem key={props.priceId} {...props} codeObj={codes.find(x => x.price === price.priceId)} />
                        })
                    })
                }

            </View>
            <View className="buy_reason">
                <AtTextarea
                    value={reasonText}
                    onChange={(val)=>{setReasonText(val)}}
                    maxLength={200}
                    placeholder='退款原因...'
                />
            </View>
            <View className="buy_footer">
                <View className="left">
                    <Text className="await-pay">退款金额:</Text>
                    <Text className="amount-money">¥{totalFee}</Text>
                </View>
                <View className="right">
                    <button onClick={confirmRefund}>确认退款</button>
                </View>
            </View>


        </View>
    )
}
