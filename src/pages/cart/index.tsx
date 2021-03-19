import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useSelector } from 'react-redux'
import BuyItem from './item/index'
import { getWindowHeight } from '@utils/style'
import { get as getGlobalData } from '../../global_data'
import cartPng from './assets/cart.png'
import { AtButton } from 'taro-ui'
import { cartDataToBuy } from '@actions/cart'
import {useDispatch} from 'react-redux'
import './index.scss'


const findImg = getGlobalData("findImg")
export default () => {
    const dispatch = useDispatch()
    const [totalFee, setTotalFee] = useState(0)
    const cartState = useSelector(state => state.cart)
    const buyList = cartState.buyList
  
    
    useEffect(() => {
        Taro.setNavigationBarTitle({
            title:"购物车"
        })
        if(buyList.length){
            const totalFee = buyList.map(item=>{
                return item.prices.map(p=>{
                  return p.discount * (p.buyQuantity || 1)
                }).reduce((p,c)=>p+c)
              }).reduce((p,c)=>p+c).toFixed(2)
              setTotalFee(totalFee)
        }
    }, [buyList])

    const goTo = (url) => {
        Taro.switchTab({
            url
        })
    }
    const jumpFun = ()=>{
        Taro.navigateTo({
            url:'/pages/buy/index',
        })
    }
    const goToBuy = ()=>{
        dispatch(cartDataToBuy(jumpFun))
        
    }
    const cartNoDtatNode = <View className="no-data">
        <Image src={cartPng} />
        <Text>还没选购</Text>
        <button onClick={() => { goTo('/pages/index/index') }}>赶紧逛逛</button>
    </View>

    const cartDataNode =  <View className="buy_list">

            {
                buyList?.map(item => {
                    return item.prices?.map(price => {
                        const buyQuantity = price.buyQuantity ? price.buyQuantity : 1
                        const props = { ...price, ...item, buyQuantity, indexImg: findImg(item.indexImg) }
                        return <BuyItem key={props.priceId} {...props} />
                    })
                })
            }
            <View className="buy_item-last-child"></View>
        </View>


    return (
        <View className='buy'>

            {
                buyList.length
                    ?
                    cartDataNode
                    :
                    cartNoDtatNode
            }
            {
                buyList.length
                    ?
                    <View className="buy_footer">
                        <View className="left">
                            <Text className="await-pay">待支付:</Text>
                            <Text className="amount-money">¥{totalFee}</Text>
                        </View>
                        <View className="right">
                            <AtButton className="button" type="primary" onClick={() => { goToBuy() }}>去结算</AtButton>
                        </View>
                    </View>
                    :
                    null
            }
        </View>
    )
}
