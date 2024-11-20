## Setup project

This project is seperated 2 folders: One folder servered as package, one folder is nextjs

Node version:
```v21.7.3```

- clone project:
```https://github.com/shnguyen-glo/stripe-js-test.git```

After clone project:

### Setup package:
```
- cd stripe-js-test/server/node
- cp .env.example .env (Get your own stripe-js key by register account: https://dashboard.stripe.com/login)
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
