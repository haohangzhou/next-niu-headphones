import { useState } from 'react';
import Product from '../../components/Product.jsx';
import { client, urlFor } from '../../lib/client';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { addToCart, openCart } from '../../store/features/cart.js';
import Link from 'next/link.js';
import toast, { Toaster } from 'react-hot-toast';

const ProductDetail = ({ product, products }) => {
	const dispatch = useDispatch();
	const { name, image, details, price } = product;

	// display images[index] when hover on images
	const [selectedIndex, setSelectedIndex] = useState(0);

	// quantity to add to cart
	const [quantity, setQuantity] = useState(1);

	// successful toast
	const success = () => {
		toast('added to cart!');
	};

	// add to cart
	const handleAddToCart = () => {
		const productToAdd = { ...product, quantity };
		dispatch(addToCart(productToAdd));
		success();
	};

	// Buy now functionality
	// 1. add item to cart
	// 2. open cart
	const handleBuyNow = () => {
		const productToAdd = { ...product, quantity };
		dispatch(addToCart(productToAdd));
		dispatch(openCart());
	};

	return (
		<div>
			<div className='product-detail-container'>
				<div>
					<div className='image-container'>
						<img
							src={urlFor(image && image[selectedIndex])}
							className='product-detail-image'
						/>
					</div>
					<div className='small-images-container'>
						{image?.map((item, i) => (
							<img
								key={i}
								src={urlFor(item)}
								className={
									i === selectedIndex
										? 'small-image selected-image'
										: 'small-image'
								}
								onMouseEnter={() => setSelectedIndex(i)}
							/>
						))}
					</div>
				</div>

				<div className='product-detail-desc'>
					<h1>{name}</h1>
					<div className='reviews'>
						<div>
							<BsStarFill />
							<BsStarFill />
							<BsStarFill />
							<BsStarFill />
							<BsStarHalf />
						</div>
						<p>(20)</p>
					</div>
					<h4>Details: </h4>
					<p>{details}</p>
					<p className='price'>${price}</p>
					<div className='quantity'>
						<h3>Quantity:</h3>
						<p className='quantity-desc'>
							<span
								className='minus'
								onClick={() =>
									setQuantity((quantity) => quantity && quantity - 1)
								}>
								<AiOutlineMinusCircle />
							</span>
							<span className='num'>{quantity}</span>
							<span
								className='plus'
								onClick={() => setQuantity((quantity) => quantity + 1)}>
								<AiOutlinePlusCircle />
							</span>
						</p>
					</div>
					<div className='buttons'>
						<button
							type='button'
							className='add-to-cart'
							onClick={handleAddToCart}>
							Add to Cart
						</button>
						<button type='button' className='buy-now' onClick={handleBuyNow}>
							Buy Now
						</button>
					</div>
				</div>
			</div>

			<div className='maylike-products-wrapper'>
				<h2>You may also like</h2>
				<div className='marquee'>
					<div className='maylike-products-container track'>
						{products.map((item) => (
							<Link key={item._id} href={`product/${item.name}`}>
								<Product product={item} />
							</Link>
						))}
					</div>
				</div>
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

// pre-define all the routes needed to be rendered
export const getStaticPaths = async () => {
	// get all the products' slug
	const query = `*[_type == "product"] {
		slug{
			current
		}
	}`;

	// fetch all the product and map the slugs to the params
	const products = await client.fetch(query);
	const paths = products.map((product) => ({
		params: {
			slug: product.slug.current,
		},
	}));

	return {
		paths: paths,
		fallback: 'blocking',
	};
};

export const getStaticProps = async ({ params: { slug } }) => {
	const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
	const allProducts = '*[_type == "product"]';

	const product = await client.fetch(query);
	const products = await client.fetch(allProducts);

	return {
		props: { product, products },
	};
};

export default ProductDetail;
