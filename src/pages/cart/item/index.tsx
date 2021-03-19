import React from 'react'
import {View,Image,Text} from '@tarojs/components'
import {AtInputNumber} from 'taro-ui'
import {useDispatch,useSelector} from 'react-redux'
import { MODIFY_CART_QUANTITY } from '@constants/cart'

export default (props) => {
    const {title,discount,unit,buyQuantity,name,indexImg,cost} = props
    const cartState = useSelector(state => state.cart)
    const { buyList } = cartState
    const dispatch = useDispatch()
    const handelChange = (val,item,e)=>{
        // 如果清除输入框的数字，就不处理
        if(e.detail?.value === ''){
            return 
        }
        
        if(val===undefined) return
        const payload = buyList.map(findItem=>{
            const {prices} = findItem
            const newPrices = prices.map(price=>{
                if(price.priceId===item.priceId){
                    return {...price,buyQuantity:val}
                }else{
                    return price
                }
            })
            // 把购买数量为0的价格删除
            return {...findItem,prices:newPrices.filter(x=>x.buyQuantity>0 || x.buyQuantity === undefined)}
        })
        // 把购买数量为0的价格删除
        dispatch({type:MODIFY_CART_QUANTITY,payload:payload.filter(x=>x.prices.length)})
        
    }

    
    return (
        <View className="buy_item">
            <View className="buy_item_left">
                <Image src={indexImg.picUrl} />
            </View>
            <View className="buy_item_right">
                <Text className="buy_item_right_title" numberOfLines={1}>{title}</Text>
                <Text className="buy_item_right_spe">{name}</Text>
                <Text className="buy_item_right_price">单价:¥{discount}{unit && ` / ${unit}`} x {buyQuantity}</Text>
                <View className="buy_item_right_buy-quantity">
                    <AtInputNumber
                        size="normal"
                        min={0}
                        max={cost}
                        width={200}
                        value={buyQuantity}
                        type="number"
                        onChange={(val,e) => { handelChange(val,props,e) }}
                    />
                </View>
            </View>
        </View>
    )
}
