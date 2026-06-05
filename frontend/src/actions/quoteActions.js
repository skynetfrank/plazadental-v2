import Axios from 'axios';
import {
    QUOTE_CREATE_FAIL,
    QUOTE_CREATE_REQUEST,
    QUOTE_CREATE_SUCCESS,
    QUOTE_DETAILS_FAIL,
    QUOTE_DETAILS_REQUEST,
    QUOTE_DETAILS_SUCCESS,
    QUOTE_LIST_FAIL,
    QUOTE_LIST_REQUEST,
    QUOTE_LIST_SUCCESS,
    QUOTE_UPDATE_FAIL,
    QUOTE_UPDATE_REQUEST,
    QUOTE_UPDATE_SUCCESS,
} from '../constants/quoteConstants';

export const createQuote = (quote) => async (dispatch, getState) => {
    dispatch({ type: QUOTE_CREATE_REQUEST, payload: quote });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await Axios.post('/api/quotes', quote, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });
        dispatch({ type: QUOTE_CREATE_SUCCESS, payload: data.quote });
    } catch (error) {
        dispatch({
            type: QUOTE_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const updateQuote = (quote) => async (dispatch, getState) => {
    dispatch({ type: QUOTE_UPDATE_REQUEST, payload: quote });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await Axios.put(`/api/quotes/${quote._id}`, quote, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: QUOTE_UPDATE_SUCCESS, payload: data.quote });
    } catch (error) {
        dispatch({
            type: QUOTE_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listQuotes = () => async (dispatch, getState) => {
    dispatch({ type: QUOTE_LIST_REQUEST });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await Axios.get('/api/quotes', {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: QUOTE_LIST_SUCCESS, payload: data.quotes });
    } catch (error) {
        dispatch({
            type: QUOTE_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const detailsQuote = (quoteId) => async (dispatch, getState) => {
    dispatch({ type: QUOTE_DETAILS_REQUEST, payload: quoteId });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await Axios.get(`/api/quotes/${quoteId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: QUOTE_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: QUOTE_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};