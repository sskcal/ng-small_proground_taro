import React, { useEffect,useState } from 'react'
import Taro from '@tarojs/taro'
// import { Popup } from '@components/popup/index'
import { View, ScrollView } from '@tarojs/components'
import { getWindowHeight } from '@utils/style'
import {useRouter} from '@tarojs/taro'
import {getDetail} from '@actions/detail'
import {useDispatch} from 'react-redux'
import Gallery from './gallery/index'
import InfoBase from './infoBase/index'
import Detail from './detail/index'
import Footer from './footer/index'
import './index.scss'

const height = getWindowHeight()


export default ()=>{

    const router = useRouter()
    const dispatch = useDispatch()
    useEffect(() => {
        const {_id} = router?.params
        _id?dispatch(getDetail(_id)):Taro.showToast({title:"缺少参数",duration:1000})
        Taro.setNavigationBarTitle({
          title:"商品详情"
        })
    }, [])


    return (<View className='item'>
    <ScrollView
      scrollY
      className='item__wrap'
      style={{ height }}
    >
      <Gallery  />
      <InfoBase />
      <Detail />
    </ScrollView>



    <View className='item__footer'>
      <Footer  />
    </View>
  </View>)
}