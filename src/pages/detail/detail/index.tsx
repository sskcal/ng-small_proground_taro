import React from 'react'
import { View, RichText,Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { get as getGlobalData } from '../../../global_data'
import './index.scss'
// 获取内容区域要显示的宽度
const contentImgWidth = getGlobalData('contentImgWidth')
export default () => {
    const { content } = useSelector(state => state.detail)
    return (
        <View className="item-detail-content">
            <View className='item-detail-content__title'>
                <Text className='item-detail-content__title-txt'>商品详情</Text>
            </View>
            <RichText nodes={content.replace(/_760_./ig, `_${contentImgWidth}_.`)} />
        </View>
    )
}
