```sh
docker build -t gcr.io/pragmatic-parking-dev/pay-demo --build-arg SECRET_STRIPE_SECRET_KEY=XXXXX --build-arg PUBLIC_STRIPE_PUBLIC_KEY=XXXXX .
docker push gcr.io/pragmatic-parking-dev/pay-demo

```
