import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import {
  controlAbonoReducer,
  controlCreateReducer,
  controlDeleteReducer,
  controlDetailsReducer,
  controlesByPacienteReducer,
  controlListReducer,
  controlUpdateReducer,
  cuadreDiaReducer,
  orderGroupByDayReducer,
  ventasControlsReducer,
} from "./reducers/controlReducers";
import {
  doctorCreateReducer,
  doctorDeleteReducer,
  doctorDetailsReducer,
  doctorListReducer,
  doctorUpdateReducer,
} from "./reducers/doctorReducers";
import {
  pacienteAddControlReducer,
  pacienteAllReducer,
  pacienteCreateReducer,
  pacienteDeleteControlReducer,
  pacienteDeleteReducer,
  pacienteDetailsReducer,
  pacienteListReducer,
  pacienteUpdateReducer,
} from "./reducers/pacienteReducers";

import {
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productUpdateReducer,
  productUpdateExistenciaReducer,
  getProductbyCodeReducer,
  productAllReducer,
  onlyCodesReducer,
} from "./reducers/productReducers";
import {
  getServiciobyCodeReducer,
  servicioAllListReducer,
  servicioAllReducer,
  servicioCreateReducer,
  servicioDeleteReducer,
  servicioDetailsReducer,
  servicioListReducer,
  servicioOnlyCodesReducer,
  servicioUpdateReducer,
} from "./reducers/servicioReducers";
import {
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userRegisterReducer,
  userSigninReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  gastoCreateReducer,
  gastoDeleteReducer,
  gastoDetailsReducer,
  gastoListReducer,
  gastoUpdateReducer,
} from "./reducers/gastoReducers";

const initialState = {
  userSignin: {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
  },
};

const reducer = combineReducers({
  userList: userListReducer,
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,

  pacienteCreate: pacienteCreateReducer,
  pacienteList: pacienteListReducer,
  pacienteDetails: pacienteDetailsReducer,
  pacienteUpdate: pacienteUpdateReducer,
  pacienteDelete: pacienteDeleteReducer,
  pacienteAll: pacienteAllReducer,
  pacienteAddControl: pacienteAddControlReducer,
  pacienteDeleteControl: pacienteDeleteControlReducer,
  controlList: controlListReducer,
  controlCreate: controlCreateReducer,
  controlDetails: controlDetailsReducer,
  controlUpdate: controlUpdateReducer,
  controlDelete: controlDeleteReducer,
  controlesPorPaciente: controlesByPacienteReducer,
  controlAbono: controlAbonoReducer,
  ventasControlsReport: ventasControlsReducer,
  cuadreDia: cuadreDiaReducer,
  orderGroupDay: orderGroupByDayReducer,

  doctorCreate: doctorCreateReducer,
  doctorList: doctorListReducer,
  doctorDetails: doctorDetailsReducer,
  doctorUpdate: doctorUpdateReducer,
  doctorDelete: doctorDeleteReducer,

  productCreate: productCreateReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  productbyCode: getProductbyCodeReducer,
  productUpdateExistencia: productUpdateExistenciaReducer,
  productAll: productAllReducer,
  onlyCodes: onlyCodesReducer,

  servicioCreate: servicioCreateReducer,
  servicioList: servicioListReducer,
  servicioAllList: servicioAllListReducer,
  servicioDetails: servicioDetailsReducer,
  servicioUpdate: servicioUpdateReducer,
  servicioDelete: servicioDeleteReducer,
  serviciobyCode: getServiciobyCodeReducer,
  servicioAll: servicioAllReducer,
  serviceOnlyCodes: servicioOnlyCodesReducer,

  gastoList: gastoListReducer,
  gastoDelete: gastoDeleteReducer,
  gastoDetails: gastoDetailsReducer,
  gastoCreate: gastoCreateReducer,
  gastoUpdate: gastoUpdateReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;
