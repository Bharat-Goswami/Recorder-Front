import {configureStore} from '@reduxjs/toolkit'
import AudioReducer from './audioSlice'


export const store = configureStore({
    reducer:{
        audio: AudioReducer,
    }
})
