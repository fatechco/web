import { NextResponse } from "next/server";
import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";

export const GET = async () => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    next: { revalidate: Number(process.env.NEXT_PUBLIC_CACHE_TIME) },
  });
  return NextResponse.json(parseSettings(settings?.data));
};
