

export type ResultListType = {
    children: any[]
    clientIp: string
    create_time: Date
    orderNo: number
    origin: string
    payBackTotalFee: number
    payTime: Date
    phone: string
    prepayId: string
    realName: string
    requestPayment: { timeStamp: string, nonceStr: string, package: string, signType: string, paySign: string }
    status: string
    totalFee: number
    update_time: Date
    userid: string
    _id: string
}

export type OrdersType = {
    resultList: ResultListType[]
    totalPage: number
    count: number
    current: number
    keyWord: string
    type: string
}

export type CodesType = {
    author: string
    code: number
    create_time: Date
    order: string
    price: string
    product: string
    productInfo: { title: string, speName: string }
    quantity: number
    recoveryLog: any[]
    refundQuantity: number
    status: string
    update_time: Date
    useLog: any[]
    useQuantity: number
    _id: string
}

export type RefundDataType = {
    // code: number
    // create_time: Date
    buyQuantity:number //购买数量
    discount:number //购买优惠价
    order: string
    price: string
    productInfo: {title: string, speName: string}
    quantity: number
    useQuantity: number
    refundQuantity: number
    // recoveryLog: any[]
    status: string
    update_time: Date
    // useLog: any[]
    _id: string
}

export type InitialStateType = {
    nickName: string
    avatarUrl: string
    gender: string
    orders: OrdersType,
    codes: CodesType[],
    refundData: RefundDataType[],
}