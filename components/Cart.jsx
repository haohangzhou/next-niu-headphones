import axios from 'axios';
import { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
	AiOutlineMinus,
	AiOutlinePlus,
	AiOutlineShopping,
	AiOutlineClose,
} from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';

import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';
import {
	closeCart,
	increment,
	decrement,
	removeItem,
	setCartTotal,
} from '../store/features/cart';

const Cart = () => {
	const { cartItems, cartTotal } = useSelector((state) => state.cart);
	const dispatch = useDispatch();

	const cartRef = useRef();

	const handleCheckout = async () => {
		const stripe = await getStripe();

		const response = await axios({
			url: '/api/stripe',
			method: 'post',
			data: cartItems,
		});
		if (response.statusCode === 500) return;

		const { data } = await response;

		setTimeout(() => {
			stripe.redirectToCheckout({ sessionId: data.id });
		}, 1500);

		toast.loading('Redirecting to checkout page');
	};

	useEffect(() => {
		dispatch(setCartTotal());
	}, [cartItems, dispatch]);

	// close cart when click outside of cart component
	useEffect(() => {
		window.addEventListener('mousedown', (e) => {
			if (cartRef.current && !cartRef.current.contains(e.target)) {
				dispatch(closeCart());
			}
		});
	}, [cartRef, dispatch]);

	return (
		<div className='cart-wrapper'>
			<div className='cart-container' ref={cartRef}>
				<h3 className='cart-header'>Your Cart</h3>
				<button
					type='button'
					className='cart-heading'
					onClick={() => dispatch(closeCart())}>
					<AiOutlineClose />
				</button>

				{cartItems.length < 1 && (
					<div className='empty-cart'>
						<AiOutlineShopping size={150} />
						<h3>Your shopping bag is empty</h3>

						<button
							type='button'
							onClick={() => dispatch(closeCart())}
							className='btn'>
							Continue Shopping
						</button>
					</div>
				)}

				<div className='product-container'>
					{cartItems.length >= 1 &&
						cartItems.map((item) => (
							<div className='product' key={item._id}>
								<img
									src={urlFor(item?.image[0])}
									className='cart-product-image'
									alt={item.name}
								/>
								<div className='item-desc'>
									<div className='flex top'>
										<h5>{item.name}</h5>
										<h4>${item.price}</h4>
									</div>
									<div className='flex bottom'>
										<div>
											<p className='quantity-desc'>
												<span
													className='minus'
													onClick={() => dispatch(decrement(item))}>
													<AiOutlineMinus />
												</span>
												<span className='num'>{item.quantity}</span>
												<span
													className='plus'
													onClick={() => dispatch(increment(item))}>
													<AiOutlinePlus />
												</span>
											</p>
										</div>
										<button
											type='button'
											className='remove-item'
											onClick={() => dispatch(removeItem(item))}>
											<TiDeleteOutline />
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
				{/* cart total */}
				{cartItems.length >= 1 && (
					<div className='cart-bottom'>
						<div className='total'>
							<h3>Subtotal:</h3>
							<h3>${cartTotal}</h3>
						</div>
						<div className='btn-container'>
							<button type='button' className='btn' onClick={handleCheckout}>
								Pay with Stripe
							</button>
						</div>
					</div>
				)}
			</div>
			<Toaster
				toastOptions={{
					duration: 1500,
					style: {
						background: '#37B624',
						color: '#ffffff',
					},
				}}
			/>
		</div>
	);
};

export default Cart;
