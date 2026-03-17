import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import storyService from "@/services/story";
import { HomePage4Content } from "./content";

const HomePage = async () => {
  /*const lang = (await cookies()).get("lang")?.value || "en";
  const countryId = (await cookies()).get("country_id")?.value || undefined;
  const cityId = (await cookies()).get("city_id")?.value || undefined;
  const shops = await shopService.getAll({
    lang,
    perPage: 8,
    column: "r_avg",
    sort: "desc",
    country_id: countryId,
    city_id: cityId,
  });
  const settings = await globalService.settings();
  const stories = await storyService.getAll({ lang });
  const parsedSettings = parseSettings(settings?.data);
  const productsEnabled = parsedSettings?.products_enabled === "1";
  return (
    <HomePage4Content
      settings={parsedSettings}
      stories={stories}
      shops={shops}
      productsEnabled={productsEnabled}
    />
  );*/
};

export default HomePage;
