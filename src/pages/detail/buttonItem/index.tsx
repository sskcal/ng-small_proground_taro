import React from 'react'
import Taro, { Component } from '@tarojs/taro'
import { Button, Text } from '@tarojs/components'
import { postcss } from '@utils/style'

import './index.scss'

export default (props) => {
  const {text} = props
  return <Button className="comp-button comp-button--primary">
    <Text className="comp-button__txt comp-button__txt--primary">
     {text}
    </Text>
  </Button>
}
