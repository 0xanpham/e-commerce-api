# E commerce API

This is a REST API for an ecommerce website, designed to handle essential ecommerce functionalities such as managing products, viewing user inventory, and processing payments using Stripe.

## Feature

- Product Management: Create and list products.
- User Inventory: Manage user-specific inventory.
- Payment Integration: Payment processing through Stripe.

## Documentation

[API Documentation](https://documenter.getpostman.com/view/38061701/2sAYBd78Gd) is available via Postman.

## Live Demo

Visit [Live Demo](https://e-commerce-web-chi-nine.vercel.app) to interact with the API through a simple web interface.

Click the `Buy` button to be redirected to the Stripe Checkout page. Use any of these test cards to simulate a payment.

Payment succeeds: `4242 4242 4242 4242`

Payment requires authentication: `4000 0025 0000 3155`

Payment is declined: `4000 0000 0000 9995`
