import aws_config from "../aws-exports";

const publishableKeys = {
  dev:
    "pk_test_51IWoNlAXegvVyt5sEGxoPrV9MfyryI7OR5vKuY4bLXUgqWIE2Dv0TmtY5R9BVHpjhg3qssoAF3z5GhtkgHrc8Mc400VDRuU2yX",
  feature:
    "pk_test_51IWoNlAXegvVyt5sEGxoPrV9MfyryI7OR5vKuY4bLXUgqWIE2Dv0TmtY5R9BVHpjhg3qssoAF3z5GhtkgHrc8Mc400VDRuU2yX",
  prod:
    "pk_live_51IWoNlAXegvVyt5sQjMoFQhf5BLPr5r6VX5Fk8ZVYZ5Oy7Uex5aBxSPKUxT9Fa3eZreFbdHjs8Bh9p5RkWq9KIVN00ySTL3CHJ",
};

const stripe_endpoint_name = aws_config.aws_cloud_logic_custom[1].endpoint.split(
  "/"
);
const env = stripe_endpoint_name[stripe_endpoint_name.length - 1];

export const getStripeKey = () => {
  return publishableKeys[env];
};
