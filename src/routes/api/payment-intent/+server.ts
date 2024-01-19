import { SECRET_STRIPE_SECRET_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'
import Stripe from 'stripe'

const stripe = new Stripe(SECRET_STRIPE_SECRET_KEY)

async function makeIntent(amount: number) {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: amount,
		currency: 'jpy',
		// payment_method_types: [']
		// payment_method_types: []
	})

	return paymentIntent.client_secret
}

export const POST: RequestHandler = async (event) => {
	const { amount } = await event.request.json()

	const clientSecret = await makeIntent(amount)
	return new Response(JSON.stringify({ clientSecret }), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
