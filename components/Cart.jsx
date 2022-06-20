import Link from 'next/link';
import { useEffect } from 'react';
import {
	AiOutlineMinus,
	AiOutlinePlus,
	AiOutlineShopping,
	AiOutlineClose,
} from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';

import { urlFor } from '../lib/client';
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

	useEffect(() => {
		dispatch(setCartTotal());
	}, [cartItems, dispatch]);

	return (
		<div className='cart-wrapper'>
			<div className='cart-container'>
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
						<Link href='/'>
							<button
								type='button'
								onClick={() => dispatch(closeCart())}
								className='btn'>
								Continue Shopping
							</button>
						</Link>
					</div>
				)}

				<div className='product-container'>
					{cartItems.length >= 1 &&
						cartItems.map((item) => (
							<div className='product' key={item._id}>
								<img
									src={urlFor(item?.image[0])}
									className='cart-product-image'
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
												<span className='num' onClick=''>
													{item.quantity}
												</span>
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
							<button type='button' className='btn' onClick={() => {}}>
								Pay with Stripe
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
