import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import rightArrow from './assets/right-arrow.png'
import {useSelector} from 'react-redux'
import './index.scss'

export default () => {
    const detailState = useSelector(state => state.detail)
    const {title} = detailState
    
    return title ? <View className='item-info-base'>
    <View className='item-info-base__header'>
      <View className='item-info-base__header-wrap'>
        <Text className='item-info-base__header-name'>{detailState.title}</Text>
        <Text className='item-info-base__header-desc'>{detailState.des}</Text>
      </View>
      {/* <View className='item-info-base__header-star'>
        <Text className='item-info-base__header-star-txt'>
          {`${parseFloat(itemStar.goodCmtRate) || 0}%`}
        </Text>
        <Text className='item-info-base__header-star-link'>{'好评率>'}</Text>
      </View> */}
    </View>

    <View className='item-info-base__price'>
      <Text className='item-info-base__price-symbol'>¥</Text>
      <Text className='item-info-base__price-txt'>
        {detailState.pagePrice}
      </Text>
      {!!detailState.retailPrice &&
        <Text className='item-info-base__price-origin'>
          ¥{detailState.retailPrice}
        </Text>
      }
    </View>

    {!!detailState.tags.length &&
      <View className='item-info-base__tag'>
        {detailState.tags?.map(item => (
          <View key={item} className='item-info-base__tag-item'>
            <Text className='item-info-base__tag-item-txt'>{item}</Text>
            <Image className='item-info-base__tag-item-img' src={rightArrow} />
          </View>
        ))}
      </View>
    }
  </View>:
      <View>数据加载中……</View>
}