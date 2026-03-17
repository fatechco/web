"use client";

import { useSettings } from "@/hook/use-settings";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import AnchorLeftIcon from "@/assets/icons/anchor-left";
import { useIsApple } from "@/hook/use-is-apple";

export const AppList = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const isAppleDevice = useIsApple();

  const list = [
    {
      link: isAppleDevice ? settings?.customer_app_ios : settings?.customer_app_android,
      title: "client.app",
    },
    {
      link: isAppleDevice ? settings?.vendor_app_ios : settings?.vendor_app_android,
      title: "business.app",
    },
    {
      link: isAppleDevice ? settings?.pos_app_ios : settings?.pos_app_android,
      title: "pos.system",
    },
    {
      link: isAppleDevice ? settings?.delivery_app_ios : settings?.delivery_app_android,
      title: "driver.app",
    },
  ];

  return (
    <div className="flex flex-col md:gap-7 gap-3">
      {list.map((item) => (
        <Link
          href={item.link || ""}
          key={item.title}
          className="md:grid flex justify-between grid-cols-2 items-center gap-28 bg-gradient-to-r from-white to-transparent rounded-button md:py-7 py-4 md:px-12 px-5"
        >
          <span className="md:text-3xl text-xl font-medium">{t(item.title)}</span>
          <AnchorLeftIcon style={{ rotate: "180deg" }} />
        </Link>
      ))}
    </div>
  );
};
