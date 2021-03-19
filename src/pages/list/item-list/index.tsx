import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { get as getGlobalData } from '../../../global_data'
import './index.scss'
const findImg = getGlobalData("findImg")
export default (props) => {

    const handleClick = (item) => {
        Taro.navigateTo({
            url: `/pages/detail/index?_id=${item._id}`
        })
    }


    const { list } = props
    
    return (
        <View className='comp-item-list'>

            <View className='comp-item-list__wrap'>
                {list?.map(item => (
                    <View
                        key={item.id}
                        className='comp-item-list__item'
                        onClick={() => { handleClick(item) }}
                    >
                        <Image className='comp-item-list__item-img' src={findImg(item.listImg)?.picUrl || ''} />
                        <View className='comp-item-list__item-info'>
                            {/* {!!item.limitedTag &&
                                <Tag text={item.limitedTag} />
                            } */}
                            <Text className='comp-item-list__item-name' numberOfLines={1}>
                                {item.title}
                            </Text>

                            <View className='comp-item-list__item-price-wrap'>
                                {item.pagePrice && <Text className='comp-item-list__item-price'>
                                    ¥{item.pagePrice}
                                </Text>}
                                {!!item.retailPrice &&
                                    <Text className='comp-item-list__item-price--origin'>
                                        ¥{item.retailPrice}
                                    </Text>
                                }
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}

