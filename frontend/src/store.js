import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { cartReducer } from "./reducers/cartReducers";

import {
  cuadreDiaReducer,
  orderAllReducer,
  orderCreateReducer,
  orderDeleteReducer,
  orderDetailsReducer,
  orderGroupByDayReducer,
  orderSummaryReducer,
  weeklyOrdersReducer,
} from "./reducers/orderReducers";

import {
  productDetailsReducer,
  productListReducer,
  productConteoRapidoReducer,
  productAllReducer,
  productCargaStockReducer,
  productUpdateReducer,
  productSearchReducer,
} from "./reducers/productReducers";

import {
  userDetailsReducer,
  userRegisterReducer,
  userSigninReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import { ajusteCreateReducer, ajusteDetailsReducer, ajusteListReducer } from "./reducers/ajusteReducers";
import { cuadrecajaUpdateReducer } from "./reducers/cuadrecajaReducers";
import { clienteDetailsReducer, clienteUpdateProfileReducer } from "./reducers/clienteReducers";
import {
  gastoCreateReducer,
  gastoDeleteReducer,
  gastoDetailsReducer,
  gastoListReducer,
  gastoUpdateReducer,
} from "./reducers/gastoReducers";
import {
  empleadoAddContratoReducer,
  empleadoAddValeReducer,
  empleadoAllReducer,
  empleadoCreateReducer,
  empleadoDeleteReducer,
  empleadoDeleteValeReducer,
  empleadoDetailsReducer,
  empleadoListReducer,
  empleadoUpdateReducer,
} from "./reducers/empleadoReducers";

const initialState = {
  userSignin: {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
  },
  cart: {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    clienteInfo: localStorage.getItem("clienteInfo") ? JSON.parse(localStorage.getItem("clienteInfo")) : {},
  },
};

const reducer = combineReducers({
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userUpdate: userUpdateReducer,
  cart: cartReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productConteoRapido: productConteoRapidoReducer,
  productAll: productAllReducer,
  productCargaStock: productCargaStockReducer,
  productUpdate: productUpdateReducer,
  productSearch: productSearchReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderDelete: orderDeleteReducer,
  orderSummary: orderSummaryReducer,
  orderAll: orderAllReducer,
  cuadreDia: cuadreDiaReducer,
  orderGroupDay: orderGroupByDayReducer,
  weeklyOrdersReport: weeklyOrdersReducer,
  ajusteCreate: ajusteCreateReducer,
  ajusteDetails: ajusteDetailsReducer,
  ajusteList: ajusteListReducer,
  cuadrecajaUpdate: cuadrecajaUpdateReducer,
  clienteDetails: clienteDetailsReducer,
  clienteUpdateProfile: clienteUpdateProfileReducer,
  gastoList: gastoListReducer,
  gastoDelete: gastoDeleteReducer,
  gastoDetails: gastoDetailsReducer,
  gastoCreate: gastoCreateReducer,
  gastoUpdate: gastoUpdateReducer,
  empleadoCreate: empleadoCreateReducer,
  empleadoList: empleadoListReducer,
  empleadoDetails: empleadoDetailsReducer,
  empleadoUpdate: empleadoUpdateReducer,
  empleadoDelete: empleadoDeleteReducer,
  empleadoAll: empleadoAllReducer,
  empleadoAddVale: empleadoAddValeReducer,
  empleadoAddContrato: empleadoAddContratoReducer,
  empleadoDeleteVale: empleadoDeleteValeReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;
