// place files you want to import through the `$lib` alias in this folder.
import { PUBLIC_STRIPE_PUBLIC_KEY } from '$env/static/public'
import { loadStripe } from '@stripe/stripe-js'

export const getStripe = async () => {
	const stripe = await loadStripe(PUBLIC_STRIPE_PUBLIC_KEY)
	if (stripe) return stripe

	throw new Error('stripe is incorrect')
}
