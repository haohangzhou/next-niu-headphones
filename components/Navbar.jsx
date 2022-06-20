import Link from 'next/link';
import { BsBag } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { openCart } from '../store/features/cart';
import Cart from './Cart';

const Navbar = () => {
	const { isOpen, cartItems } = useSelector((state) => state.cart);
	const dispath = useDispatch();
	return (
		<div className='navbar-container'>
			<p className='logo'>
				<Link href='/'>Nius Headphones</Link>
			</p>

			<button
				type='button'
				className='cart-icon'
				onClick={() => dispath(openCart())}>
				<BsBag />
				<span className='cart-item-qty'>{cartItems.length}</span>
			</button>
			{isOpen && <Cart />}
		</div>
	);
};

export default Navbar;
