import React,{useEffect} from 'react'
import { View, ScrollView } from '@tarojs/components'
import { getWindowHeight } from '@utils/style'
import Taro from '@tarojs/taro'

import LeftMenu from './leftMenu'
import RightMenuList from './rightMenuList'
import './index.scss'
const height = getWindowHeight()
const Cate = () => {
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "分类"
    })
  }, [])
    return (
        <View className='cate'>
            <ScrollView
                scrollY
                className='cate__menu'
                style={{ height }}
            >
                <LeftMenu />
            </ScrollView>
            <ScrollView
            scrollY
            className='cate__list'
            style={{ height }}
          >
            <View className='cate__list-wrap'>
              {/* <Banner banner={banner} /> */}
              <RightMenuList />
            </View>
          </ScrollView>
        </View>
    )
}
export default Cate