import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import { getWindowHeight } from '@utils/style'
import { useSelector, useDispatch } from 'react-redux'
import BuyItem from './item'
import { get as getGlobalData } from '../../global_data'
import Taro from '@tarojs/taro'
import { buySubmit } from '@actions/buy'
import { CLEAR_CART_DATA } from '@constants/cart'
import { CLEAR_BUY_DATA } from '@constants/buy'
import './index.scss'


const findImg = getGlobalData("findImg")
export default () => {
  const buyState: any = useSelector(state => state.buy)
  const [discountFee, setDiscountFee] = useState(0)
  const { realName, phone, } = buyState.contact
  const [contact, setContact] = useState({ realName, phone,discountCode:'' })
  const [showDiscountCode, setShowDiscountCode] = useState(true)
  const { buyList, requestPaymentObj } = buyState
  const dispatch = useDispatch()

  const submit = () => {
    const { realName, phone } = contact
    if (!realName) {
      return Taro.showToast({
        title: "请填写联系人",
        icon: "none",
      })
    }
    if (!phone) {
      return Taro.showToast({
        title: "请填写手机号",
        icon: "none",
      })
    }
    if (!(/^1\d{10}$/.test(phone))) {
      return Taro.showToast({
        title: "手机号不正确",
        icon: "none",
      })
    }
    if (requestPaymentObj.paySign) {
      return requestPayMent()
    }
    dispatch(buySubmit({ contact }))
  }
  // 调起微信支付
  const requestPayMent = () => {
    Taro.requestPayment({
      ...requestPaymentObj,
      success: function (res) {
        if (res.errMsg === 'requestPayment:ok') {
          // 1.1清除购物车状态数据
          dispatch({ type: CLEAR_CART_DATA })
          dispatch({ type: CLEAR_BUY_DATA })
          // 1、支付成功,先跳转到"我的"页面
          Taro.switchTab({
            url: '/pages/user/index',
            success: (res) => {
              setTimeout(() => {
                // 2、跳转到“我的”页面成功，接着跳转到支付成功列表页
                Taro.navigateTo({
                  url: '/pages/user/orders/index?type=1',
                })
              }, 300)
            }
          })
        }
      }
    }).catch(res => {
      if (res.errMsg === 'requestPayment:fail cancel') {
        // 清除购物车状态数据
        dispatch({ type: CLEAR_CART_DATA })
        dispatch({ type: CLEAR_BUY_DATA })
        Taro.switchTab({
          url: '/pages/user/index',
          success: (res) => {
            if (res.errMsg === 'switchTab:ok') {
              Taro.navigateTo({
                url: '/pages/user/orders/index?type=0',
              })
            }
          }
        })
      }
    })
  }

  useEffect(() => {
    if (requestPaymentObj.paySign) {
      requestPayMent()
    }
    Taro.setNavigationBarTitle({
      title:'立即支付'
    })
  }, [requestPaymentObj])
  const totalFeeCalc = buyList.map(item => {
    return item.prices.map(p => {
      return p.discount * (p.buyQuantity || 1)
    }).reduce((p, c) => p + c)
  })
  const totalFee = totalFeeCalc.length ? totalFeeCalc.reduce((p, c) => p + c).toFixed(2) : 0
  
  
  return (
    <View className='buy'>
      <View className='buy-form'>
      <AtForm>
        <AtInput
          name="realName"
          title='联系人'
          type='text'
          placeholder='请输入联系人名字'
          value={contact.realName}
          onChange={(val) => setContact((x: any) => ({ ...x, realName: val }))}
        />
        <AtInput
          name="phone"
          title='手机号'
          type='text'
          placeholder='请输入收货人手机号'
          value={contact.phone}
          onChange={(val) => setContact((x: any) => ({ ...x, phone: val }))}
        />
      </AtForm>
      <View className="discount-code" onClick={() => { 
        setShowDiscountCode(x=>!x)
       }}>我有优惠码</View>
      <View  style={{display:showDiscountCode?'none':''}}>
        <AtForm>
          <AtInput
            name="discountCode"
            title='优惠码'
            type='text'
            value={contact.discountCode}
            placeholder='没有无需输入'
            onChange={(val) => {
              if(val==='ygyh'){
                setDiscountFee(0.1)
              }
              setContact((x: any) => ({ ...x, discountCode: val }))
            }}
          />
        </AtForm>
      </View>
      </View>
      
        <View className="buy_list">

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
   
      <View className="buy_footer">
        <View className="buy_footer_left">
          <Text className="buy_footer_left_await-pay">待支付:</Text>
          <Text className="buy_footer_left_pay-amount-money">¥{discountFee > 0?discountFee: totalFee}</Text>
        </View>
        <View className="buy_footer_right">
          <AtButton className="buy_footer_right_button" type="primary" onClick={() => { submit() }}>立即支付</AtButton>
        </View>
      </View>
    </View>
  )
}
