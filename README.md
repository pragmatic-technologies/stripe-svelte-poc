```sh
docker build -t gcr.io/pragmatic-parking-dev/pay-demo --build-aSECRET_STRIPE_SECRET_KEY=XXXXX --build-argPUBLIC_STRIPE_PUBLIC_KEY=XXXXX .
docker push gcr.io/pragmatic-parking-dev/pay-demo

```
