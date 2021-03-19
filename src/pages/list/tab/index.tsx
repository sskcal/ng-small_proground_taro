import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import {getList} from '@actions/list'
import {useDispatch} from 'react-redux'
import './index.scss'
type PropsType = {
    list:any[],
    cateId:string,
    setSelectTabIndex:any,
}
export default ({list,cateId,setSelectTabIndex}:PropsType) => {


    const handleClick = (cateId,index)=>{

        setSelectTabIndex(index)
    }
    useEffect(()=>{
        // 设置初始选中的tab的index
        list.map((x,index)=>{
            if(x._id === cateId){
                setSelectTabIndex(index)
            }
        })
    },[])
    
    return (
        <ScrollView
            scrollX
            className='cate-sub-tab'
        >
            {list.map((item,index) => (
                <View
                    key={item._id}
                    className='cate-sub-tab__item'
                    onClick={()=>{handleClick(item._id,index)}}
                >
                    <Text className='cate-sub-tab__item-txt'>{item.name}</Text>
                    {item._id === cateId &&
                        <View className='cate-sub-tab__item-line' />
                    }
                </View>
            ))}
        </ScrollView>
    )
}

