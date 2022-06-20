import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
	cartItems: [],
	cartTotal: 0,
	isOpen: false,
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		openCart: (state) => {
			state.isOpen = true;
		},
		closeCart: (state) => {
			state.isOpen = false;
		},
		addToCart: (state, { payload }) => {
			const productInCart = state.cartItems.find(
				(item) => item._id === payload._id
			);
			if (!productInCart) {
				state.cartItems = [...state.cartItems, payload];
			} else {
				state.cartItems.map((item) => {
					if (item._id === payload._id) {
						return (item.quantity += payload.quantity);
					}
					return item;
				});
			}
		},
		increment: (state, { payload }) => {
			state.cartItems.map((item) => {
				if (item._id === payload._id) return (item.quantity += 1);
				return item;
			});
		},
		decrement: (state, { payload }) => {
			state.cartItems.map((item) => {
				if (item._id === payload._id && item.quantity)
					return (item.quantity -= 1);
				return item;
			});
		},
		removeItem: (state, { payload }) => {
			state.cartItems = state.cartItems.filter(
				(item) => item._id !== payload._id
			);
		},
		setCartTotal: (state) => {
			state.cartTotal = state.cartItems.reduce(
				(total, product) => total + product.quantity * product.price,
				0
			);
		},
	},
});

export const {
	openCart,
	closeCart,
	addToCart,
	increment,
	decrement,
	removeItem,
	setCartTotal,
} = cartSlice.actions;
export default cartSlice.reducer;
