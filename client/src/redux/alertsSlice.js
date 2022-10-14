import {createSlice} from '@reduxjs/toolkit';
const alertSlice = createSlice({
    name:"alerts",
    initialState:{
        loading :false
    },
    reducers:{
        showLoading:(state,action)=>{
            state.loading=true
        },
        hideLoading:(state,action)=>{
            state.loading=false
        }
    }
})

export const {showLoading, hideLoading} = alertSlice.actions
export default alertSlice.reducer