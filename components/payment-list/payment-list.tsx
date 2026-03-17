import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { RadioGroup } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import { RadioFillIcon } from "@/assets/icons/radio-fill";
import { Payment } from "@/types/global";
import { LoadingCard } from "@/components/loading";
import dynamic from "next/dynamic";
import { useSettings } from "@/hook/use-settings";
import { userService } from "@/services/user";
import useUserStore from "@/global-store/user";
import { Price } from "@/components/price";
import { Wallet } from "./wallet";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface PaymentListProps {
  value?: Payment;
  totalPrice?: number;
  fromWalletPrice?: number;
  onChange: (value?: Payment) => void;
  onChangeWalletPrice: (value?: number) => void;
  filter?: (value: Payment) => boolean;
}

export const PaymentList = ({
  value,
  totalPrice,
  fromWalletPrice,
  onChange,
  onChangeWalletPrice,
  filter,
}: PaymentListProps) => {
  const { currency } = useSettings();
  const user = useUserStore((state) => state.user);
  const signIn = useUserStore((state) => state.signIn);
  useQuery(["profile"], () => userService.profile(), {
    onSuccess: (res) => {
      signIn(res?.data);
    },
  });
  const { data, isLoading } = useQuery(["payments"], () =>
    orderService.paymentList({ active: 1, currency_id: currency?.id })
  );
  const { t } = useTranslation();

  const walletPayment = data?.data?.find((item) => item.tag === "wallet");
  const difference = (totalPrice || 0) - (fromWalletPrice || 0);

  if (isLoading) {
    return (
      <div className="py-10">
        <LoadingCard />
      </div>
    );
  }

  if (data?.data && data.data.length === 0) {
    return <Empty animated={false} smallText />;
  }

  return (
    <>
      {(user?.wallet?.price || 0) > 0 && (
        <Wallet
          totalPrice={totalPrice}
          fromWalletPrice={fromWalletPrice}
          onChangeWalletPrice={onChangeWalletPrice}
          onFullPricePaid={() => onChange(walletPayment)}
        />
      )}
      <div className="w-full h-4" />
      <RadioGroup value={value || null} onChange={onChange}>
        <RadioGroup.Label className="sr-only">{t("payment.type")}</RadioGroup.Label>
        <div className="space-y-2">
          {data?.data
            ?.filter((item) => item?.tag !== "wallet")
            .map(
              (payment) =>
                (filter ? filter(payment) : true) && (
                  <RadioGroup.Option
                    key={payment.id}
                    value={payment}
                    className={({ active, checked }) =>
                      `${active ? "ring-2 ring-white/60 ring-offset-2 ring-offset-primary " : ""}
                  ${checked ? "border-dark" : "border-gray-link"}
                    relative flex cursor-pointer rounded-lg px-5 py-3 focus:outline-none border`
                    }
                  >
                    {({ checked }) => (
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                          {checked ? (
                            <RadioFillIcon />
                          ) : (
                            <span className="text-gray-link">
                              <EmptyCheckIcon size={14} />
                            </span>
                          )}
                          <div className="text-sm">
                            <RadioGroup.Label as="p" className="font-medium">
                              {t(payment.tag)}{" "}
                              {checked && !!fromWalletPrice && (
                                <span>
                                  (<Price number={difference} />)
                                </span>
                              )}
                            </RadioGroup.Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                )
            )}
        </div>
      </RadioGroup>
    </>
  );
};
