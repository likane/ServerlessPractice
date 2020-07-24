import React from "react";
import { Notification, Message } from "element-react";
import StripeCheckout from 'react-stripe-checkout';
import { API } from "aws-amplify";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey: "xxxxxxxx"
}

//DID NOT INSTALL THE REST LAMBDA FUNCTION THIS REFERES TOO
const PayButton = ({product, user}) => {
  const handleCharge = () => {
    try {
      const result = await API.post('orderlambda', '/charge',{
        body:{
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: product.price,
            description: product.description
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <StripeCheckout 
      token={handleCharge}
      email={user.attributes.email}
      name={product.description}
      amount={amount.price}
      currency={stripeConfig.currency}
      stripeKey={stripeConfig.publishableAPIKey}
      shippingAddress={product.shipped}
      billingAddress={product.shipped}
      locale="auto"
      allowRememberMe={false}
    />
    );
};

export default PayButton;
