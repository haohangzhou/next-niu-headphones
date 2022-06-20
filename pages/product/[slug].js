import { useState } from 'react';
import Product from '../../components/Product.jsx';
import { client, urlFor } from '../../lib/client';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/features/cart.js';
import Link from 'next/link.js';

const ProductDetail = ({ product, products }) => {
	const { name, image, details, price } = product;
	const { cartItems } = useSelector((state) => state.cart);
	// display images[index] when hover on images
	const [selectedIndex, setSelectedIndex] = useState(0);

	// quantity to add to cart
	const [quantity, setQuantity] = useState(1);

	const dispatch = useDispatch();

	// add to cart
	const handleAddToCart = (product, quantity) => {
		const productToAdd = { ...product, quantity };
		console.log('productToAdd:', productToAdd);
		dispatch(addToCart(productToAdd));
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
							onClick={() => handleAddToCart(product, quantity)}>
							Add to Cart
						</button>
						<button type='button' className='buy-now' onClick={() => {}}>
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

	console.log(product);

	return {
		props: { product, products },
	};
};

export default ProductDetail;
