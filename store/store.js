import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/features/cart';

const store = configureStore({
	reducer: {
		cart: cartReducer,
	},
	devTools: `${process.env.NODE_ENV === 'development'}`,
});

export default store;
