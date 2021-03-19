import { combineReducers } from 'redux'
import recommend from './recommend'
import cate from './cate'
import list from './list'
import detail from './detail'
import user from './user'
import buy from './buy'
import cart from './cart'

export default combineReducers({
  recommend,
  cate,
  list,
  detail,
  user,
  buy,
  cart
})
