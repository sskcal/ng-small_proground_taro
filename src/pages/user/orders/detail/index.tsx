import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { useRouter } from '@tarojs/taro'
import { get as getGlobalData } from '../../../../global_data'
import dayjs from 'dayjs'
import Taro from '@tarojs/taro'
import { OrderItemChildrenType, PricesType } from '../types'
import { featchRefund } from '@actions/user'
import {useDispatch} from 'react-redux'
import './index.scss'
import refund from '../refund'
const findImg = getGlobalData("findImg")

export default () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [refundsData, setRefundsData] = useState([])
    const resultList = useSelector(state => state?.user?.orders?.resultList || [])
    const { orderId } = router.params
    const detailState = resultList.find(x => x._id === orderId)
    const [detail, setDetail] = useState(detailState)
    const { realName, phone, status, totalFee, create_time, requestPayment: requestPaymentObj, children, orderNo } = detail
    useEffect(()=>{
        Taro.setNavigationBarTitle({
            title:"订单详情"
        })
    },[])

    const pItem = children?.map((x: OrderItemChildrenType) => {
        const { prices, title, indexImg } = x
        // const { discount, buyQuantity, name, deliverStatus } = ;
        return prices.map((xItem: PricesType) => {
            const { discount, buyQuantity, name, deliverStatus,priceId } = xItem
            let refundQuantity = 0
            if(refundsData.length){
                refundsData.find((x:any)=>x.children.find(z=>{z.price === priceId?refundQuantity=refundQuantity+z.refundQuantity:0}))
            }
            
            
            return (
                <View className="price-body">
                    <View className="img">
                        <Image src={findImg(indexImg).picUrl || ''} />
                    </View>
                    <View className="conetent">
                        <View className="title">{title},{name}</View>
                        <View className="discount">优惠价：{discount} x {buyQuantity}</View>
                        <View className="discount">发货状态：<Text className="deliver-status">{deliverStatus || "未发货"}</Text></View>
                        {refundQuantity>0?<View className="discount">退款数量:{refundQuantity}</View>:null}
                    </View>
                </View>
            )
        })
    })
    const requestPayment = ({ requestPaymentObj, orderId }) => {
        Taro.requestPayment({
            ...requestPaymentObj,
            success: function (res) {
                if (res.errMsg === 'requestPayment:ok') {
                    // 1、支付成功,先跳转到"我的"页面
                    Taro.switchTab({
                        url: '/pages/user/index',
                        success: (res) => {
                            if (res.errMsg.indexOf('ok') > -1) {
                                // 2、跳转到“我的”页面成功，接着跳转到支付成功列表页
                                Taro.navigateTo({
                                    url: '/pages/user/orders/index?type=1',
                                    success: (res) => {
                                        // 3、跳转到详情页
                                        if (res.errMsg.indexOf('ok') > -1) {
                                            Taro.navigateTo({
                                                url: '/pages/user/orders/detail/index?orderId=' + orderId
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }).catch(res => {
            console.log(res);

        })
    }
    const goToCodes = () => {
        Taro.navigateTo({
            url: '/pages/user/orders/codes/index?orderId=' + orderId
        })
    }
    const allBtn = ({  requestPaymentObj, orderId }) => {
        const btns = {
            "待支付": [<button className="pay-button" onClick={() => {
                requestPayment({ requestPaymentObj, orderId })
            }}>支付</button>],
            "已支付": [<button className="pay-button" onClick={goToCodes}>电子码</button>],
        }
        return btns
    }
    // useEffect(() => {
    //     console.log(status,'----');
        
    //     if(status.indexOf('退款')>-1){
    //         // 获取退款订单
    //         dispatch(featchRefund({orderId,cb:(res)=>{
    //             const {status,data} = res
    //             if(status){
    //                 setRefundsData(data)
    //             }
                
    //         }}))
    //     }
    // }, [status])

    return (
        <View className="body">
            <View className="status">
                <View className="orders-menu-title">订单状态</View>
                <View><Text>创建时间：</Text>{dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')}</View>
                <View><Text>订单号：</Text>{orderNo}</View>
                <View><Text>支付状态：</Text>{status}</View>
            </View>
            <View className="contact">
                <View className="orders-menu-title">收货信息</View>
                <View><Text>联系人：</Text>{realName}</View>
                <View><Text>手机号：</Text>{phone}</View>
            </View>
            <View className="product">
                <View className="orders-menu-title">商品清单</View>
                {
                    pItem
                }
            </View>
            <View className="bottom">
                <View className="total">
                    <View className="totalStr">总金额:</View>
                    <View className="totalFee">{totalFee.toFixed(2)}</View>
                </View>
                <View className="btn">
                    {/* {
                        allBtn({ status, requestPaymentObj, orderId })
                    } */}
                </View>
            </View>
        </View>
    )
}
