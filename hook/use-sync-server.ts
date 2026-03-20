import useAddressStore from "@/global-store/address";
import { DefaultResponse, LikeTypes } from "@/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { likeService } from "@/services/like";
import useLikeStore from "@/global-store/like";
import { useSettings } from "@/hook/use-settings";

export const useSyncServer = () => {
  const { currency, language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const queryClient = useQueryClient();
  const { list, setMany } = useLikeStore();
  const notSentList = {
    property: list.property.filter((listItem) => !listItem.sent),
    master: list.master.filter((listItem) => !listItem.sent),
    shop: list.shop.filter((listItem) => !listItem.sent),
  };
  const handleSaveMany = (type: LikeTypes) => {
    likeService
      .getAll({
        type,
        lang: language?.locale,
        currency_id: currency?.id,
      })
      .then((res) => {
        setMany(
          type,
          res.data.map((product) => ({ itemId: product.id, sent: true }))
        );
      });
  };
  const { mutate: likeMany } = useMutation(
    ["likeMany"],
    (type: LikeTypes) =>
      likeService.likeMany({
        types: notSentList[type].map((listItem) => ({
          type,
          type_id: listItem.itemId,
        })),
      }),
    {
      onSuccess: (_, type) => {
        handleSaveMany(type);
      },
    }
  );

  
  const handleSync = () => {
    
    if (
      notSentList.property.length > 0 ||
      notSentList.master.length > 0 ||
      notSentList.shop.length > 0
    ) {
      if (notSentList.property.length > 0) likeMany("property");
      if (notSentList.master.length > 0) likeMany("master");
      if (notSentList.shop.length > 0) likeMany("shop");
    } else {
      handleSaveMany("property");
      handleSaveMany("master");
      handleSaveMany("shop");
    }
  };
  return { handleSync };
};
