import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
// import fetcher from "@/lib/fetcher";
import { parseSettings } from "@/utils/parse-settings";
// import { DefaultResponse, Setting } from "@/types/global";

// const getSettings = async () => {
//   try {
//     const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
//       next: { revalidate: Number(process.env.NEXT_PUBLIC_CACHE_TIME) },
//     });
//     return parseSettings(settings?.data);
//   } catch (e) {
//     return {};
//   }
// };

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const settings = await fetch(`http://${request.nextUrl.host}/api/cache/settings`).then(
    (res) => res.json() as Promise<ReturnType<typeof parseSettings>>
  );
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    settings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }

  if (
    !(await cookies()).has("token") &&
    (pathname.includes("/profile") || pathname.includes("/orders"))
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl, 302);
  }

  const uiType = ["2", "3", "4"].find((type) => type === settings?.ui_type);

  if (!!uiType && pathname === "/") {
    return NextResponse.rewrite(new URL(`/home-${uiType}`, request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
