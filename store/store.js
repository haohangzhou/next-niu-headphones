import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/features/cart';

const store = configureStore({
	reducer: {
		cart: cartReducer,
	},
});

export default store;
