import {
    QUOTE_CREATE_FAIL,
    QUOTE_CREATE_REQUEST,
    QUOTE_CREATE_RESET,
    QUOTE_CREATE_SUCCESS,
    QUOTE_DETAILS_FAIL,
    QUOTE_DETAILS_REQUEST,
    QUOTE_DETAILS_SUCCESS,
    QUOTE_LIST_FAIL,
    QUOTE_LIST_REQUEST,
    QUOTE_LIST_SUCCESS,
    QUOTE_UPDATE_FAIL,
    QUOTE_UPDATE_REQUEST,
    QUOTE_UPDATE_RESET,
    QUOTE_UPDATE_SUCCESS,
} from '../constants/quoteConstants';

export const quoteCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case QUOTE_CREATE_REQUEST:
            return { loading: true };
        case QUOTE_CREATE_SUCCESS:
            return { loading: false, success: true, quote: action.payload };
        case QUOTE_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case QUOTE_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const quoteUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case QUOTE_UPDATE_REQUEST:
            return { loading: true };
        case QUOTE_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case QUOTE_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case QUOTE_UPDATE_RESET:
            return {};
        default:
            return state;
    }
};

export const quoteListReducer = (state = { quotes: [] }, action) => {
    switch (action.type) {
        case QUOTE_LIST_REQUEST:
            return { loading: true };
        case QUOTE_LIST_SUCCESS:
            return { loading: false, quotes: action.payload };
        case QUOTE_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const quoteDetailsReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case QUOTE_DETAILS_REQUEST:
            return { loading: true };
        case QUOTE_DETAILS_SUCCESS:
            return { loading: false, quote: action.payload };
        case QUOTE_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};