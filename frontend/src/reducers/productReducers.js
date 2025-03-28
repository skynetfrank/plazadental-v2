import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_RESET,
  PRODUCT_CATEGORY_LIST_REQUEST,
  PRODUCT_CATEGORY_LIST_SUCCESS,
  PRODUCT_CATEGORY_LIST_FAIL,
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_FAIL,
  PRODUCT_REVIEW_CREATE_RESET,
  PRODUCT_UPDATE_EXISTENCIA_REQUEST,
  PRODUCT_UPDATE_EXISTENCIA_SUCCESS,
  PRODUCT_UPDATE_EXISTENCIA_FAIL,
  PRODUCT_UPDATE_EXISTENCIA_RESET,
  PRODUCT_BYCODE_REQUEST,
  PRODUCT_BYCODE_SUCCESS,
  PRODUCT_BYCODE_FAIL,
  PRODUCT_BYCODE_RESET,
  PRODUCT_ALL_REQUEST,
  PRODUCT_ALL_SUCCESS,
  PRODUCT_ALL_FAIL,
  PRODUCT_ONLY_CODES_REQUEST,
  PRODUCT_ONLY_CODES_SUCCESS,
  PRODUCT_ONLY_CODES_FAIL,
} from "../constants/productConstants";

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productListReducer = (state = { loading: true, productos: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload.productos,
        pages: action.payload.pages,
        page: action.payload.page,
        count: action.payload.count,
      };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productCategoryListReducer = (state = { loading: true, productos: [] }, action) => {
  switch (action.type) {
    case PRODUCT_CATEGORY_LIST_REQUEST:
      return { loading: true };
    case PRODUCT_CATEGORY_LIST_SUCCESS:
      return { loading: false, categories: action.payload };
    case PRODUCT_CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
export const productReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_REVIEW_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true, review: action.payload };
    case PRODUCT_REVIEW_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_REVIEW_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateExistenciaReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_EXISTENCIA_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_EXISTENCIA_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_UPDATE_EXISTENCIA_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_EXISTENCIA_RESET:
      return {};
    default:
      return state;
  }
};

export const getProductbyCodeReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PRODUCT_BYCODE_REQUEST:
      return { loading: true };
    case PRODUCT_BYCODE_SUCCESS:
      return { loading: false, success: true, producto: action.payload };
    case PRODUCT_BYCODE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_BYCODE_RESET:
      return { error: false, product: {} };
    default:
      return state;
  }
};

export const productAllReducer = (state = { productos: [] }, action) => {
  switch (action.type) {
    case PRODUCT_ALL_REQUEST:
      return { loading: true };
    case PRODUCT_ALL_SUCCESS:
      return { loading: false, productos: action.payload.productos };
    case PRODUCT_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const onlyCodesReducer = (state = { loading: true, codigos: [] }, action) => {
  switch (action.type) {
    case PRODUCT_ONLY_CODES_REQUEST:
      return { loading: true };
    case PRODUCT_ONLY_CODES_SUCCESS:
      let codigos = action.payload.codigos;
      codigos.unshift({ codigo: " " });
      return {
        loading: false,
        codigos: codigos,
      };
    case PRODUCT_ONLY_CODES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
