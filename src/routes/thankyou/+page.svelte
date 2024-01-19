<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { getStripe } from '$lib'
	import type { PaymentIntentResult, Stripe } from '@stripe/stripe-js'
	import { format } from 'date-fns'

	let stripe: Stripe
	let result: PaymentIntentResult

	onMount(async () => {
		stripe = await getStripe()
	})

	$: if ($page.url && stripe) {
		console.log('ready', stripe)
		const clientSecret = $page.url.searchParams.get('payment_intent_client_secret') as string
		stripe.retrievePaymentIntent(clientSecret).then((r) => (result = r))
	}

	$: {
		console.log($page.url.searchParams.get('redirect_status'))
		console.log($page.url.searchParams.get('payment_intent'))
		console.log($page.url.searchParams.get('payment_intent_client_secret'))
	}
</script>

<h1>Hey that worked! thanks for paying!</h1>
<p>
	{#if result}
		<div>
			{result.paymentIntent?.amount} yen was retrieved
		</div>
		<div>
			payment method: {result.paymentIntent?.payment_method}
		</div>
		<div>
			status: {result.paymentIntent?.status}
		</div>
		<div>
			confirmation method: {result.paymentIntent?.confirmation_method}
		</div>
		<div>
			description: {result.paymentIntent?.description}
		</div>
		<div>
			payment method type: {result.paymentIntent?.payment_method_types}
		</div>
		<div>
			created: {format(result.paymentIntent?.created * 1000, 'yyyy-MM-dd HH:mm:ss')}
		</div>
	{/if}
</p>

<a href="/">go back</a>
