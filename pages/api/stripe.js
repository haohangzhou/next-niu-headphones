const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

// copied from Stripe docs
export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const params = {
				submit_type: 'pay',
				mode: 'payment',
				payment_method_types: ['card'],
				billing_address_collection: 'auto',
				shipping_options: [
					{ shipping_rate: 'shr_1LCjZtJEoCVZTtwVTyuZGT3g' },
					{ shipping_rate: 'shr_1LCjcRJEoCVZTtwV4irbukp9' },
				],
				line_items: req.body.map((item) => {
					const img = item.image[0].asset._ref;
					const newImage = img
						.replace(
							'image-',
							'https://cdn.sanity.io/images/t3wc0jqg/production/'
						)
						.replace('-webp', '.webp');

					return {
						price_data: {
							currency: 'aud',
							product_data: {
								name: item.name,
								images: [newImage],
							},
							unit_amount: item.price * 100, // in cents
						},
						adjustable_quantity: {
							enabled: true,
							minimum: 1,
						},
						quantity: item.quantity,
					};
				}),
				// redirect to /success page after completing checkout
				success_url: `${req.headers.origin}/success`,
				// redirect to home page if cancel checkout
				cancel_url: `${req.headers.origin}/`,
			};

			const session = await stripe.checkout.sessions.create(params);
			res.status(200).json(session);
		} catch (err) {
			res.status(err.statusCode || 500).json(err.message);
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}
