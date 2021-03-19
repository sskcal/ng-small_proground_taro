import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { get as getGlobalData } from '../../../global_data'
import Taro from '@tarojs/taro'
import './index.scss'

const findImg = getGlobalData('findImg')
export default () => {
    const cateState = useSelector(state => state.cate)
    const { rightMenuList } = cateState
    
    
    const handleClick = (_id) => {
        Taro.navigateTo({
            url: `/pages/list/index?cateId=${_id}`
        })
    }
    return (
        <View className='cate-list'>
            {rightMenuList.map(group => (
                <View key={group.id} className='cate-list__group'>
                    {!!group.name &&
                        <View className='cate-list__title'>
                            <Text className='cate-list__title-txt'>{group.name}</Text>
                        </View>
                    }
                    <View className='cate-list__wrap'>
                        {group.children?.length && group.children.map((item, index) => {
                            const { banner } = item
                            // ''可以给张默认图片路径
                            const { picUrl } = banner.length?findImg(banner):''
                            return (
                                <View
                                    key={item._id}
                                    className={classNames('cate-list__item',
                                        { 'cate-list__item--right': (index + 1) % 3 === 0 }
                                    )}
                                    onClick={() => {
                                        handleClick(item._id)
                                    }}
                                >
                                    <Image className='cate-list__item-img' src={picUrl} />
                                    <View className='cate-list__item-txt-wrap'>
                                        <Text className='cate-list__item-txt'>{item.name}</Text>
                                    </View>
                                </View>
                            )
                        }
                        )}
                    </View>
                </View>
            ))}
        </View>
    )
}
