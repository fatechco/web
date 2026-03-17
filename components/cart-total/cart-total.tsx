import { CartCalculateRes } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { Price } from "@/components/price";
import { Transaction } from "@/types/global";
import clsx from "clsx";

interface CartTotalProps {
  totals?: Partial<CartCalculateRes>;
  couponStyle?: boolean;
  showTotalTax?: boolean;
  transactions?: Transaction[];
}

export const CartTotal = ({
  totals,
  showTotalTax,
  couponStyle = true,
  transactions,
}: CartTotalProps) => {
  const { t } = useTranslation();
  return (
    <div className={couponStyle ? "coupon" : ""}>
      {!!totals?.price && (
        <div className="flex items-center justify-between py-4 border-b border-gray-border">
          <span className="text-sm">{t("products")}</span>
          <span className="text-sm">
            <Price number={totals?.price} />
          </span>
        </div>
      )}
      {!!totals?.total_discount && (
        <div className="flex items-center justify-between py-4 border-b border-gray-border">
          <span className="text-sm">{t("discount")}</span>
          <span className="text-sm">
            -<Price number={totals?.total_discount} />
          </span>
        </div>
      )}
      {!!totals?.delivery_fee &&
        (typeof totals.delivery_fee === "object"
          ? totals?.delivery_fee?.length !== 0
          : !!totals.delivery_fee) && (
          <div className="flex items-center justify-between py-4 border-b border-gray-border">
            <span className="text-sm">{t("delivery.fee")}</span>
            <span className="text-sm">
              <Price
                number={
                  typeof totals.delivery_fee === "object"
                    ? totals?.delivery_fee?.reduce((acc, curr) => acc + curr.price, 0)
                    : totals.delivery_fee
                }
              />
            </span>
          </div>
        )}
      {!!totals?.total_shop_tax && (
        <div className="flex items-center justify-between py-4 border-b border-gray-border">
          <span className="text-sm">{t("total.tax")}</span>
          <span className="text-sm">
            <Price number={totals?.total_shop_tax} />
          </span>
        </div>
      )}
      {!!totals?.total_tax && showTotalTax && (
        <div className="flex items-center justify-between py-4 border-b border-gray-border">
          <span className="text-sm">{t("total.tax")}</span>
          <span className="text-sm">
            <Price number={totals?.total_tax} />
          </span>
        </div>
      )}
      {!!totals?.service_fee && (
        <div className="flex items-center justify-between py-4 border-b border-gray-border">
          <span className="text-sm">{t("service.fee")}</span>
          <span className="text-sm">
            <Price number={totals?.service_fee} />
          </span>
        </div>
      )}
      {!!totals?.tips && (
        <div className="flex items-center justify-between py-4 border-b border-gray-border">
          <span className="text-sm">{t("tips")}</span>
          <span className="text-sm">
            <Price number={totals?.tips} />
          </span>
        </div>
      )}
      {totals?.coupon && (
        <div className="flex items-center justify-between py-4 ">
          <span className="text-sm">{t("coupon")}</span>
          <span className="text-sm">
            -<Price number={totals?.coupon?.reduce((acc, curr) => acc + curr.price, 0)} />
          </span>
        </div>
      )}
      {!!totals?.total_coupon_price && (
        <div className="flex items-center justify-between py-4 ">
          <span className="text-sm">{t("coupon")}</span>
          <span className="text-sm">
            -<Price number={totals?.total_coupon_price} />
          </span>
        </div>
      )}
      <div className="h-px bg-dark dark:bg-gray-200" />
      <div className="h-px bg-dark mt-2.5 dark:bg-gray-200" />
      <div className="flex items-center justify-between mt-7">
        <strong className="text-[22px] font-bold">{t("total")}</strong>
        <strong className="text-[22px] font-bold">
          <Price number={totals?.total_price ?? 0} />
        </strong>
      </div>
      {!!transactions?.length &&
        transactions?.map((transaction) => (
          <div
            key={transaction?.id}
            className="flex items-center justify-between py-4 border-b border-gray-border"
          >
            <span className="text-sm">{t(transaction?.payment_system?.tag)}</span>
            <span
              className={clsx(
                "text-sm",
                transaction?.payment_system?.tag === "wallet" && "text-red"
              )}
            >
              {transaction?.payment_system?.tag === "wallet" && "- "}
              <Price number={transaction?.price} />
            </span>
          </div>
        ))}
    </div>
  );
};
