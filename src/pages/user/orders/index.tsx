
import React, { useEffect, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import { ScrollView, View, Image, Text } from '@tarojs/components'
import { featchOrders } from '@actions/user'
import { useDispatch, useSelector } from 'react-redux'
import { getWindowHeight } from '@utils/style'
import { OrderItemChildrenType, OrderItemType, PricesType } from './types'
import { get as getGlobalData } from '../../../global_data'
import Taro from '@tarojs/taro'
import { CLEAR_DATA } from '@constants/user'
import { closeOrder, cancelRefund } from '@actions/user'
import './index.scss'

const findImg = getGlobalData('findImg')
const pageName = {
    "0": "待支付",
    "1": "已支付",
    "2": "退款",
    "3": "待评价",
    "4": "全部",
}
const height = getWindowHeight()
export default () => {
    const [isLoding, setIsLoding] = useState(true)
    const [bottomStr, setBottomStr] = useState(<View></View>)
    // const [btns, setBtns] = useState(<View></View>)
    const router = useRouter()
    const type = router.params.type || -1


    const dispatch = useDispatch()
    const pageTitle = pageName[type]
    const userOrdersState = useSelector(state => state.user.orders)
    const { current, resultList, totalPage } = userOrdersState
    const getData = (cPage = 1, cType: any = 0) => {
        setIsLoding(true)
        dispatch(featchOrders({
            current: cPage, type: cType, cb: (res) => {
                setIsLoding(false)
            }
        }))
    }
    // 滚动触底执行
    const onScrollToLower = () => {

        if (totalPage <= current) {
            return setBottomStr(<View className="order-end">没更多数据了……</View>)
        }
        getData(current + 1, type)
    }
    // 调起微信支付
    const requestPayment = ({ requestPaymentObj, orderId }) => {
        Taro.requestPayment({
            ...requestPaymentObj,
            success: function (res) {
                if (res.errMsg === 'requestPayment:ok') {
                    // 1、支付成功,先跳转到"我的"页面
                    Taro.switchTab({
                        url: '/pages/user/index',
                        success: (res) => {
                            if (res.errMsg === 'switchTab:ok') {
                                // 2、跳转到“我的”页面成功，接着跳转到支付成功列表页
                                Taro.navigateTo({
                                    url: '/pages/user/orders/index?type=1',
                                    success: (res) => {
                                        if (res.errMsg === 'navigateTo:ok') {
                                            // 3、跳转到详情页
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



    useEffect(() => {
        Taro.setNavigationBarTitle({
            title: pageTitle + "订单"
        })
        if (!(resultList.length) && !(userOrdersState.type === type)) {
            getData(1, type)
        }
        return () => {

            dispatch({ type: CLEAR_DATA })
        }
    }, [])
    // 取消退款
    const handelCancelRefund = (orderId) => {
        dispatch(cancelRefund({
            orderId, cb: (res) => {
                const { status, msg } = res
                if (!status) return Taro.showToast({ title: msg, icon: 'none' })
                Taro.switchTab({
                    url: '/pages/user/index',
                    success: () => {
                        Taro.navigateTo({
                            url: '/pages/user/orders/index?type=1',
                            success: () => {
                                Taro.showToast({ title: '取消退款成功', icon: 'success', duration: 3000 })
                            }
                        })

                    }
                })
            }
        }))
    }
    // 跳转到电子码详情
    const goToCodes = (orderId) => {
        Taro.navigateTo({
            url: '/pages/user/orders/codes/index?orderId=' + orderId
        })
    }
    // 跳转到退款详情
    const goToRefund = (orderId) => {
        Taro.navigateTo({
            url: '/pages/user/orders/refund/index?orderId=' + orderId
        })
    }

    const btnColor = { style: { background: '#f9f9f9', color: '#463d' } }
    /**
     * 
     * @param status 付款状态
     * @param orderId 订单_id
     * @param requestPaymentObj 调起支付obj
     * @param recordDeliverStatus 订单是否发货记录，是个数组
     */
    const btnAll = (item): any[] => {
        const { _id: orderId, requestPayment: requestPaymentObj, children } = item
        let paymentSuccessBtns: any[] = [];


        // if (status.indexOf('支付成功')>-1) {
        //     // 如果有未发货的订单
        //     if (recordDeliverStatus.length) {
        //         paymentSuccessBtns = [<button {...btnColor} onClick={() => goToRefund(orderId)}>申请退款</button>, <button>催促发货</button>]
        //     } else {
        //         if(status === '支付成功') paymentSuccessBtns = [<button {...btnColor} onClick={() => goToRefund(orderId)}>申请退款</button>, <button onClick={goToCodes.bind(this,orderId)}>电子码</button>]
        //         if(status === '支付成功,部分退款中') paymentSuccessBtns = [<button {...btnColor} onClick={() => goToRefund(orderId)}>申请退款</button>,<button onClick={handelCancelRefund.bind(this,orderId)}>取消退款</button>, <button onClick={goToCodes.bind(this,orderId)}>电子码</button>]
        //         if(status === '支付成功,部分已退款') paymentSuccessBtns = [<button {...btnColor} onClick={() => goToRefund(orderId)}>申请退款</button>,<button onClick={goToCodes.bind(this,orderId)}>电子码</button>]
        //     }
        // }

        // 待支付、已支付、退款中、已退款、待评价、已完成、已关闭
        const btns = {
            '待支付': [<button {...btnColor} onClick={() => { dispatch(closeOrder({ orderId })) }}>关闭</button>, <button onClick={() => requestPayment({ requestPaymentObj, orderId })}>支付</button>],
            '已支付': [<button {...btnColor} onClick={() => goToRefund(orderId)}>申请退款</button>, <button onClick={goToCodes.bind(this, orderId)}>电子码</button>],
            '退款中': [<button onClick={handelCancelRefund.bind(this, orderId)}>取消退款</button>],
            '待评价': paymentSuccessBtns,
            '已完成': [<button onClick={handelCancelRefund.bind(this, orderId)}>取消退款</button>],
            '已关闭': [<button>评价</button>],
        }
        const btnArr: any[] = []
        children.map(item=>{
            item.prices.map(priceItem=>{
                const b = btnArr.find(x=>x[priceItem.status])
                if(!b){
                    btnArr.push({[priceItem.status]:btns[priceItem.status]})
                }
            })
        })
        
        
        return btnArr.map(x=>Object.entries(x).map(y=>y[1]))
    }

    const goTo = (orderId) => {
        Taro.navigateTo({
            url: '/pages/user/orders/detail/index?orderId=' + orderId
        })
    }




    const ordersList = resultList.map((item: OrderItemType) => {
        const { orderNo, totalFee, _id: orderId, children } = item;
        // const recordDeliverStatus: PricesType[] = []
        const pItem = children.map((x: OrderItemChildrenType) => {
            const { prices, indexImg, title } = x;
            // 查找如果有未发货的,记录一下
            // const findDeliverStatus = prices.find((x: PricesType) => !x.deliverStatus)
            // if (findDeliverStatus) {
            //     recordDeliverStatus.push(findDeliverStatus)
            // }


            return prices.map((price) => {
                const { name, discount, buyQuantity, deliverStatus, status } = price
                return (
                    <View className="body" onClick={() => { goTo(orderId) }}>
                        <View className="img">
                            <Image src={findImg(indexImg).picUrl || ''} />
                        </View>
                        <View className="conetent">
                            <View className="title">{title},{name}</View>
                            <View className="discount">优惠价：{discount} x {buyQuantity}</View>
                            <View className="discount">支付状态：{status}</View>
                            <View className="discount">发货状态：{deliverStatus || "未发货"}</View>
                        </View>
                    </View>
                )
            })

        })

        return (<View className="order-item">
            <View className="header"><Text>订单号:</Text>{orderNo}</View>
            {pItem}
            <View className="bottom">
                <View className="total">
                    <View className="totalStr">总金额:</View>
                    <View className="totalFee">{totalFee.toFixed(2)}</View>
                </View>
                <View className="btn">
                    {
                        btnAll(item)
                    }
                </View>

            </View>
        </View>)
    })

    return (
        <View>
            <ScrollView
                style={{ height }}
                scrollY
                onScrollToLower={() => onScrollToLower()}
            >
                <View className="orders">
                    {
                        ordersList
                    }
                    {isLoding ? <View className="order-end">数据加载中...</View> : null}
                    {!resultList.length && !isLoding ? <View className="order-end">暂无订单...</View> : null}
                    {bottomStr}
                </View>
            </ScrollView>
        </View>
    )
}
