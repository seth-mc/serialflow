import { useAction, useFindMany, useGlobalAction } from "@gadgetinc/react";
import { Banner, BlockStack, Card, Layout, Page, Text } from "@shopify/polaris";
import { api } from "../api";
import { PlanCard, StyledSpinner } from "../components";
import { useCallback, useContext, useEffect, useState } from "react";
import { trialCalculations } from "../utilities";
import { ShopContext } from "../providers";

/**
 * This is the billing page that will be displayed when a user hasn't selected a plan or they want to change plans.
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default () => {
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const { shop } = useContext(ShopContext);

  const [
    { data: plans, fetching: fetchingPlans, error: errorFetchingPlans },
    getPlansAtShopCurrency,
  ] = useGlobalAction(api.getPlansAtShopCurrency);

  const [
    {
      data: subscription,
      fetching: fetchingSubscription,
      error: errorSubscribing,
    },
    subscribe,
  ] = useAction(api.shopifyShop.subscribe, {
    select: {
      confirmationUrl: true,
    },
  });

  /**
   * @type { (planId: string) => void }
   *
   * Callback used to subscribe to a plan and redirect to the Shopify subscription confirmation page
   */
  const handleSubscribe = useCallback(
    async (planId) => {
      const res = await subscribe({ id: shop.id, planId });

      if (res?.data?.confirmationUrl) {
        open(res.data.confirmationUrl, "_top");
      }
    },
    [shop, subscribe]
  );

  /**
   * @type { () => void }
   *
   * Dismisses the error banner
   */
  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    const run = async () => {
      await getPlansAtShopCurrency();
    };

    run();
  }, []);

  // useEffect for showing an error banner when there's an issue fetching plans
  useEffect(() => {
    if (!fetchingPlans && errorFetchingPlans) {
      setBannerContext(errorFetchingPlans.message);
      setShow(true);
    } else if (fetchingPlans) {
      setShow(false);
    }
  }, [fetchingPlans, errorFetchingPlans]);

  // useEffect for showing an error banner when there's an issue subscribing
  useEffect(() => {
    if (!fetchingSubscription && errorSubscribing) {
      setBannerContext(errorSubscribing.message);
      setShow(true);
    } else if (fetchingSubscription) {
      setShow(false);
    }
  }, [fetchingSubscription, errorSubscribing]);

  if (fetchingPlans) {
    return <StyledSpinner />;
  }

  return (
    <Page title="Select a plan">
      <BlockStack gap="500">
        {show && (
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={handleDismiss}
          />
        )}
        <Layout>
          {plans?.length ? (
            plans?.map((plan) => (
              <Layout.Section variant="oneThird" key={plan.id}>
                <PlanCard
                  id={plan.id}
                  name={plan.name}
                  description={plan.description}
                  monthlyPrice={plan.monthlyPrice}
                  trialDays={
                    trialCalculations(
                      shop?.usedTrialMinutes,
                      shop?.usedTrialMinutesUpdatedAt,
                      new Date(),
                      plan?.trialDays
                    ).availableTrialDays
                  }
                  currency={shop.currency}
                  handleSubscribe={handleSubscribe}
                  buttonDisabled={
                    fetchingSubscription ||
                    subscription ||
                    shop?.plan?.id === plan.id
                  }
                />
              </Layout.Section>
            ))
          ) : (
            <Card>
              <BlockStack gap="500">
                <Text as="p" variant="bodyMd">
                  To complete the subscription process, you must first create a
                  plan record. You can do this by navigating to your{" "}
                  <strong>plan</strong> model's <strong>create</strong> action
                  and clicking on run action on the right of the page.
                </Text>
                <Text as="p" variant="bodyLg">
                  Since the database is split between development and
                  production, make sure to also add plans to your production
                  database once deploying and going live.
                </Text>
              </BlockStack>
            </Card>
          )}
        </Layout>
      </BlockStack>
    </Page>
  );
};
