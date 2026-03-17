import { infoService } from "@/services/info";
import { cookies } from "next/headers";
import { CareerDetailContent } from "./content";

const CareersDetailPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const lang = (await cookies()).get("lang")?.value;
  const data = await infoService.getCareer(params.id, { lang });

  return <CareerDetailContent initialData={data} />;
};

export default CareersDetailPage;
