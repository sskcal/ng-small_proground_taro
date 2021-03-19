import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'


export default () => {
    
    const cartState = useSelector(state => state.cart)
    const cartStateBuyList =  cartState.buyList?.map(x => x.prices)
    const cartCount = cartStateBuyList.length?cartStateBuyList.flat(3).length:0
    
    useEffect(() => {
        const allPage = Taro.getCurrentPages()
        const currentPage = allPage[allPage.length - 1]
        if(!currentPage){
            return
        }
        const showCartCount = [
            'pages/index/index',
            'pages/cate/index',
            'pages/cart/index',
            'pages/user/index'
        ].find(x => x === currentPage.route)
        if (showCartCount && cartCount > 0) {
            Taro.setTabBarBadge({
                index: 2,
                text: cartCount.toString(),
            })
        }
        if (showCartCount && cartCount === 0) {
            Taro.removeTabBarBadge({
                index:2
            })
        }

    })
    return null
}
