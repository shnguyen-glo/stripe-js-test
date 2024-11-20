'use client'
import { useRef, useLayoutEffect } from "react";

import MyStripe from '../../../../package/client/html/card-class';

import '../../../src/base.css';

const Page = () => {
    const stripeRef = useRef(null);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const initStripe = async () => {
            const myStripe = new MyStripe();
            await myStripe.init();
            if (containerRef.current) {
                myStripe.mount(containerRef.current);
            }
            stripeRef.current = myStripe;
        };

        initStripe();
    }, []);

    return (
        <div>
            <h4>Try a <a href="https://stripe.com/docs/testing#cards" target="_blank">test card</a>:</h4>
            <div>
                <code>4242424242424242</code> (Visa)
            </div>
            <div>
                <code>5555555555554444</code> (Mastercard)
            </div>
            <div>
                <code>4000002500003155</code> (Requires <a href="https://www.youtube.com/watch?v=2kc-FjU2-mY"
                                                           target="_blank">3DSecure</a>)
            </div>

            <p>
                Use any future expiration, any 3 digit CVC, and any postal code.
            </p>
            <div ref={containerRef}></div>
        </div>
    );
}

export default Page;
