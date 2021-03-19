import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import { AtBadge } from 'taro-ui'
import jump from '@utils/jump'
import homeIcon from './assets/home.png'
import serviceIcon from './assets/service.png'
import cartIcon from './assets/cart.png'
import { AtFloatLayout, AtTag } from "taro-ui"
import { useSelector, useDispatch } from 'react-redux'
import Auth from '@components/auth'
import { RECORD_BUY_DATA, CLEAR_BUY_DATA } from '@constants/buy'
import { RECORD_CART_DATA } from '@constants/cart'
import './index.scss'


const NAV_LIST = [{
  key: 'home',
  img: homeIcon,
  url: '/pages/index/index'
}, {
  key: 'service',
  img: serviceIcon
}, {
  key: 'cart',
  img: cartIcon,
  url: '/pages/cart/index'
}]


export default () => {
  const [isCart, setIsCart] = useState(false)
  const [isOpend, setIsOpend] = useState(false)
  const dispatch = useDispatch()
  const [tagActive, setTagActive] = useState<any[]>([])
  const detailState = useSelector(state => state.detail)
  const [buyState, cartState,userState] = useSelector(state => [state.buy, state.cart,state.user])

  const { prices = [] } = detailState
  const handleNav = (item) => {
    jump({ url: item.url, method: 'switchTab' })
  }
  const handleBuy = () => {
    //每次点击购买的时候清空购买记录
    dispatch({ type: CLEAR_BUY_DATA })
    setIsOpend(true)
    setIsCart(false)

  }
  const handelCart = () => {
    setIsOpend(true)
    setIsCart(true)
  }
  const addToCart = () => {
    if (!tagActive.length) {
      return Taro.showToast({
        title: "请选中需要购买的项目!",
        icon: 'none',
        duration: 1000,
      })
    }
    addData()
  }

  const changePrice = (item) => {
    setTagActive((x: any[]) => x.find(y => y.priceId === item._id) ? x.filter(z => z.priceId !== item._id).map(j => { delete j["_id"]; return j }) : [...x, { ...item, priceId: item._id }].map(j => { delete j["_id"]; return j }))
  }

  const goBuyItem = () => {
    if (!tagActive.length) {
      return Taro.showToast({
        title: "请选中需要购买的项目!",
        icon: 'none',
        duration: 1000,
      })
    }
    addData()
  }

  const addData = () => {
    // 检测用户是否登陆
    Taro.getStorage({
      key: "userInfo",
      success: (res) => {
        if (res.data.userid) {
          const { _id: productId, title, indexImg } = detailState
          const recordData = {
            productId,
            title,
            indexImg,
            prices: [...tagActive]
          }
          if (!isCart) {
            const payload = buyState.buyList.find(x => x.productId === productId)
              ?
              [...buyState.buyList.filter(x => x.productId !== productId), recordData]
              :
              [...buyState.buyList, recordData]
            dispatch({ type: RECORD_BUY_DATA, payload })
            Taro.navigateTo({
              url: '/pages/buy/index',
            })
          } else {
            const payload = cartState.buyList.find(x => x.productId === productId)
              ?
              [...cartState.buyList.filter(x => x.productId !== productId), recordData]
              :
              [...cartState.buyList, recordData]
            dispatch({ type: RECORD_CART_DATA, payload })
            setIsOpend(false)
          }

        }
      }
    })
  }


  return <View className='item-footer'>
    {NAV_LIST.map(item => (
      <View
        key={item.key}
        className='item-footer__nav'
        onClick={() => handleNav(item)}
      >
        {
          cartState.buyList.length
            ?
            item.key === 'cart' ? <AtBadge value={cartState.buyList.map(x => x.prices).flat(3).length} maxValue={99}><Image className='item-footer__nav-img' src={item.img} /></AtBadge> : <Image className='item-footer__nav-img' src={item.img} />
            :
            <Image className='item-footer__nav-img' src={item.img} />
        }

      </View>
    ))}
    
    
      {
        userState.avatarUrl?(<AtFloatLayout isOpened={isOpend} title="请选择合适的项目" onClose={() => setIsOpend(x => !x)}><View className="buy-tags">
        {
          prices.map(item => {
            return <AtTag
              key={item._id}
              type='primary'
              active={tagActive.find(x => x.priceId === item._id)}
              onClick={() => { changePrice(item) }}
            >
              {item.name}:¥{item.discount} {item.stock < 100 && '库存紧张'}
            </AtTag>
          })
        }
      </View>
      <View className="change-button">
        <button onClick={() => { isCart ? addToCart() : goBuyItem() }}>选好了,{isCart ? '加入购物车' : '去付款'}</button>
      </View></AtFloatLayout>):<Auth />
      }
    

    <View className='item-footer__buy' onClick={handleBuy}>
      <Text className='item-footer__buy-txt'>立即购买</Text>
    </View>
    <Button onClick={handelCart} className="comp-button comp-button--primary">
      <Text className="comp-button__txt comp-button__txt--primary">
        加入购物车
    </Text>
    </Button>
  </View>
}

