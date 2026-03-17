"use client";

import { useBooking } from "@/context/booking";
import { Payment } from "@/types/global";
import { Types } from "@/context/booking/booking.reducer";
import { PaymentList } from "@/components/payment-list";
import { useEffect } from "react";

export const BookingPaymentList = () => {
  const { state, dispatch } = useBooking();

  const handleChangePayment = (value?: Payment) => {
    dispatch({ type: Types.SetPayment, payload: value });
  };

  const handleChangeFromWalletPrice = (fromWalletPrice?: number) => {
    dispatch({ type: Types.UpdateFromWalletPrice, payload: fromWalletPrice });
    if (!fromWalletPrice) {
      handleChangePayment();
    }
  };

  useEffect(() => {
    handleChangeFromWalletPrice();
  }, [state.totalPrice]);

  return (
    <PaymentList
      value={state.payment}
      totalPrice={state.totalPrice}
      fromWalletPrice={state.fromWalletPrice}
      onChange={handleChangePayment}
      onChangeWalletPrice={handleChangeFromWalletPrice}
    />
  );
};
