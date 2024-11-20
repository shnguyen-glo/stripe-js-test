## Setup project

This project is seperated 2 folders: One folder servered as package, one folder is nextjs

Node version:
```v21.7.3```

- clone project:
```https://github.com/shnguyen-glo/stripe-js-test.git```

After clone project:

### Setup package:
Create your own stripe-js key: https://dashboard.stripe.com/login
```
- edit with your stripe-js key in file: /package/client/html/card-class.js, line 3: this.publishableKey = 'YOUR_STRIPE_KEY';
- cd stripe-js-test/server/node
- yarn install
- yarn start
```
VannilaJS app will be started at: http://localhost:4242/card.html
### Setup next-js app
```
- cd stripe-js-test/stripe-test
- yarn install
- yarn dev
```
NextJS app will be started at: http://localhost:3000/card
