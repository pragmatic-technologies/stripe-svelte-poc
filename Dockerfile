# build =================
FROM node:18 AS builder

ARG PUBLIC_STRIPE_PUBLIC_KEY
ARG SECRET_STRIPE_SECRET_KEY

RUN test -n "$PUBLIC_STRIPE_PUBLIC_KEY"
ENV PUBLIC_STRIPE_PUBLIC_KEY ${PUBLIC_STRIPE_PUBLIC_KEY}

RUN test -n "$SECRET_STRIPE_SECRET_KEY"
ENV SECRET_STRIPE_SECRET_KEY ${SECRET_STRIPE_SECRET_KEY}


WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# run =================
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/build /app/build
CMD ["node", "build"]