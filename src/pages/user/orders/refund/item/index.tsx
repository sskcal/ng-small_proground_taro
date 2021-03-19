import React, { useEffect, useState } from 'react'
import { View, Image, Text, Checkbox } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import { setRefundData } from '@actions/user'
import { AtTag } from 'taro-ui'



export default (props) => {
    const { title, discount, unit, buyQuantity, name, indexImg, codeObj } = props
    const [currentRefundData, setCurrentRefundData] = useState<any>()
    const refundDataState = useSelector(state => state.user.refundData)
    const dispatch = useDispatch()
    
    const { quantity, useQuantity, refundQuantity, price } = codeObj || {}
    const maxQuantity = quantity ? quantity - useQuantity - refundQuantity : 0
    const [tagVal, setTagVal] = useState({[props.priceId]:{active:true}})
    
    
    // const val = refundDataState ?
    //     (refundDataState?.find(x => x.price === price))?.refundQuantity :
    //     maxQuantity
    // codeState.maxQuantity


    // const handelChange = (val,e)=>{
    //     // const {price} = codeState
    //     // 如果清除输入框的数字，就不处理
    //     if(e.detail?.value === ''){
    //         return 
    //     }
    //     if(val===undefined) return
    //     const newRefundData = [...refundDataState.filter(x=>x.price !== price),{...refundDataState.find(x=>x.price === price),refundQuantity:val}]
    //     dispatch(setRefundData(newRefundData))
    // }

    // useEffect(() => {
    //     if(codeObj){


    //         setCodeState({
    //             ...codeObj,
    //             // 计算最大可退款数量
    //             maxQuantity:quantity - useQuantity - refundQuantity,
    //         })
    //     }
    // }, [codeObj])

    
    const handleChange = (tagInfo,priceId) => {
       
       setTagVal((x:any)=>{
           const val = x[priceId]?{active:!x[priceId].active || false}:{active:false}
           return ({
            ...x,
            [priceId]:val
            })
       })
        //保存当前退款数据    
       setCurrentRefundData(refundDataState.filter(x=>x.price === priceId))
        //删除当前退款数据 
       const newRefundData = tagVal[props.priceId].active?[...refundDataState.filter(x=>x.price !== priceId)]:[...refundDataState,...currentRefundData]
       
       
       
       dispatch(setRefundData(newRefundData))  

    }
    
    return (
        <View className="buy_item">
            <View className="buy_item_left" >
                <View>
                    <AtTag
                        type='primary'
                        
                        active={maxQuantity>0?tagVal[props.priceId].active:false}
                        onClick={(tagInfo)=>{
                            const tagId = props.priceId
                            handleChange(tagInfo,tagId)
                        }}
                    >
                        
                </AtTag>
                </View>
                <View><Image src={indexImg.picUrl} /></View>
            </View>
            <View className="buy_item_right">
                <Text className="buy_item_right_title" numberOfLines={1}>{title}</Text>
                <Text className="buy_item_right_spe">{name}</Text>
                <Text className="buy_item_right_price">单价:¥{discount}{unit && ` / ${unit}`} x {buyQuantity}</Text>
                <Text className="buy_item_right_price">退款数量:{maxQuantity}</Text>
            </View>
        </View>
    )
}
