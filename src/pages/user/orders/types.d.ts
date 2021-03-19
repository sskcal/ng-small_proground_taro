

type IndexImgType = {
    picUrl:string
    width:number
    height:number
}

export type PricesType= {
    _id:string
    priceId:string
    name:string
    buyQuantity: number
    discount: number
    eTime: Date
    retail: number
    validDay: number
    deliverStatus:string
    status:string
}

export type OrderItemChildrenType = {
    title:string
    indexImg:IndexImgType[]
    prices:PricesType[]
    create_time:Date
}

export type OrderItemType={
    _id:string
    children:OrderItemChildrenType[]
    orderNo:number
    realName:string
    phone:string
    requestPayment:any
    totalFee:number
}