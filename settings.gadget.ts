import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.0.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-04",
        enabledModels: [
          "shopifyAppSubscription",
          "shopifyCustomer",
          "shopifyLocation",
          "shopifyOrder",
          "shopifyProduct",
          "shopifyProductVariant",
        ],
        type: "partner",
        scopes: [
          "read_products",
          "read_customers",
          "read_orders",
          "write_orders",
          "write_products",
          "write_order_edits",
          "read_locations",
        ],
      },
    },
  },
};
