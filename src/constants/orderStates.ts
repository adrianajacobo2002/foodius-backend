export const ORDER_STATES = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELED: "CANCELED",
  DELIVERED: "DELIVERED",
} as const;

export type OrderState = (typeof ORDER_STATES)[keyof typeof ORDER_STATES];
