<script lang="ts">
	import { getStripe } from '$lib'
	import { onMount } from 'svelte'
	import { type Stripe } from '@stripe/stripe-js'
	import { Elements, LinkAuthenticationElement, PaymentElement } from 'svelte-stripe'
	import { page } from '$app/stores'

	let stripe: Stripe | null = null
	let clientSecret = ''

	onMount(async () => {
		stripe = await getStripe()
	})

	const onMakeIntent = async () => {
		// const res = await fetch('/api/payment-intent', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({ amount: amount }),
		// })
		// const { clientSecret } = await res.json()
		console.log(clientSecret)
		buildExpressCheckout(clientSecret)
		buildCard(clientSecret)
	}

	const buildCard = async (pi: string) => {
		if (!stripe) return
		const form = document.getElementById('payment-form')
		if (!form) return

		const element = stripe.elements({
			clientSecret: pi,
			appearance: {},
		})

		const paymentElement = element.create('payment', {
			layout: {
				type: 'tabs',
				radios: false,
			},
			wallets: {
				googlePay: 'never',
				applePay: 'never',
			},
			fields: {
				billingDetails: {
					address: {
						country: 'never',
					},
				},
			},
		})
		paymentElement.mount('#credit-card-element')

		form.addEventListener('submit', async (event) => {
			event.preventDefault()
			if (stripe) {
				const { error: confirmError } = await stripe.confirmPayment({
					elements: element,
					confirmParams: {
						payment_method_data: {
							billing_details: {
								address: {
									country: 'JP',
								},
							},
						},
						return_url: `${$page.url.origin}/thankyou`,
					},
				})
				if (confirmError) {
					handleError(confirmError)
					return
				}
			}
		})
	}

	const buildExpressCheckout = async (pi: string) => {
		if (!stripe) return

		const element = stripe.elements({
			clientSecret: pi,
			appearance: {
				theme: 'flat',
			},
		})
		const expressCheckoutElement = element.create('expressCheckout', {
			buttonType: {
				googlePay: 'plain',
				applePay: 'plain',
			},
			buttonTheme: {
				googlePay: 'black',
				applePay: 'white-outline',
			},
			layout: {
				maxColumns: 1,
				maxRows: 10,
			},
			paymentMethodOrder: ['googlePay', 'applePay'],
			wallets: {
				applePay: 'always',
				googlePay: 'always',
			},
		})
		expressCheckoutElement.mount('#express-checkout-element')

		expressCheckoutElement.on('confirm', async () => {
			const { error: submitError } = await element.submit()

			if (submitError) {
				handleError(submitError)
				return
			}

			if (!stripe) return

			const { error } = await stripe.confirmPayment({
				elements: element,
				clientSecret: pi,
				confirmParams: { return_url: `${$page.url.origin}/thankyou` },
			})
			if (error) {
				console.log(error)
				handleError(error)
			} else {
				// The payment UI automatically closes with a success animation.
				// Your customer is redirected to your `return_url`.
			}
		})
	}
</script>

<a href="/">Top</a>

<hr />
<div>
	<input type="text" bind:value={clientSecret} />
	<button on:click={onMakeIntent}>Update Intent</button>
</div>

<div id="error-message"></div>

<form id="payment-form">
	<div id="credit-card-element"></div>
	<button type="submit" id="submit">
		<div class="spinner hidden" id="spinner"></div>
		<span id="button-text">Pay now</span>
	</button>
</form>

<div style="height: 40px;"></div>
<div id="express-checkout-element"></div>
