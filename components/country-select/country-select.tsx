"use client";

import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import useAddressStore from "@/global-store/address";
import { Modal } from "@/components/modal";
import { useEffect, useState } from "react";

const CountrySelectPanel = dynamic(() => import("./country-select-panel"), {
  loading: () => <LoadingCard />,
});
export const CountrySelect = ({
  settings,
  defaultOpen = true,
}: {
  settings: Record<string, string>;
  defaultOpen: boolean;
}) => {
  const isCountrySelectModalOpen = useAddressStore((state) => state.isCountrySelectModalOpen);
  const closeCountrySelectModal = useAddressStore((state) => state.closeCountrySelectModal);
  const country = useAddressStore((state) => state.country);
  const [mounted, setMounted] = useState(false);
  const isModalOpen = mounted ? isCountrySelectModalOpen || !country?.id : defaultOpen;
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Modal
      size="large"
      isOpen={isModalOpen}
      onClose={closeCountrySelectModal}
      withCloseButton={false}
      overflowHidden={false}
    >
      <CountrySelectPanel settings={settings} />
    </Modal>
  );
};
