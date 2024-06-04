import { Client } from "@gadget-client/serialflow";

export const api = new Client({ environment: window.gadgetConfig.environment });
