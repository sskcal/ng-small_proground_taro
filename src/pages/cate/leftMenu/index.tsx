import React,{useState,useEffect} from 'react'
import { View,Text } from '@tarojs/components'
import {useSelector,useDispatch} from 'react-redux'
import {setRightList,getCateList} from '@actions/cate'

import './index.scss'

export default () =>{
    
    const cateState = useSelector(state => state.cate)
    // const [current, setCurrent] = useState()

    const {leftMenuList,current} = cateState
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getCateList())
    }, [])
    const handelClick = (_id)=>{
        dispatch(setRightList(_id))
    }
    return (
        <View className='cate-menu'>
        {leftMenuList.map((item) => {
            
          const active = item._id === current
          return (
            <View
              key={item._id}
              className={`cate-menu__item ${active && 'cate-menu__item--active'}`}
              onClick={()=>handelClick(item._id)}
            >
              <Text
                className={`cate-menu__item-name ${active && 'cate-menu__item--active'}`}
              >
                {item.name}
              </Text>
            </View>
          )
        })}
      </View>
    )
}
