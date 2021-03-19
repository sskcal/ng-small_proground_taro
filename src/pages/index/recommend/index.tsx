import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { get as getGlobalData } from '../../../global_data'
import { getIndexList } from '@actions/recommend'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'

import './index.scss'
const findImg = getGlobalData('findImg')
export default () => {

  const dispatch = useDispatch()
  const recommendState = useSelector(state => state.recommend)
  const { list = [], keyWord } = recommendState
  const handleClick = (_id) => {
    Taro.navigateTo({
      url: `/pages/detail/index?_id=${_id}`
    })

  }
  useEffect(() => {
    dispatch(getIndexList({ current: 1 }))
  }, [])
  return (<View className='home-recommend'>
    <View className='home-recommend__title'>
      <Text className='home-recommend__title-txt'>{keyWord ? '您的搜索结果' : '为你推荐'}</Text>
    </View>
    <View className='home-recommend__list'>
      {list.map((item) => {
        const { _id, indexImg, title, des, pagePrice, retailPrice } = item
        const img = findImg(indexImg)
        return (
          <View
            key={_id}
            className='home-recommend__list-item'
            onClick={() => handleClick(_id)}
          >
            
            
            <View className='home-recommend__list-item-info'>
            <Image className='home-recommend__list-item-img' src={img?.picUrl || 'http://pic.xiaohainan.cn/index/202102/1613557636030_420.png'} />
            {!!des &&
              <Text className='home-recommend__list-item-desc' numberOfLines={1}>
                {des}
              </Text>
            }
              <Text className='home-recommend__list-item-name' numberOfLines={1}>
                {title}
              </Text>

              <View className='home-recommend__list-item-price-wrap'>
                {!!pagePrice && <Text className='home-recommend__list-item-price'>
                  ¥{pagePrice}
                </Text>}
                {!!retailPrice &&
                  <Text className='home-recommend__list-item-price--origin'>
                    ¥{retailPrice}
                  </Text>
                }
              </View>
            </View>
          </View>
        )
      })}
    </View>
  </View>)
}
