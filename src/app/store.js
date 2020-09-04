import { configureStore } from '@reduxjs/toolkit'


// contain all reducer of all component
const rootReducer = {
}


// create store
const store = configureStore({
    reducer: rootReducer
})


export default store