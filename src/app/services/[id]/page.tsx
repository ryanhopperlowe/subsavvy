import { ServiceViewPage } from "./ServiceViewPage";

export default function ServicePage({
  params: { id },
}: {
  params: { id: string };
}) {
  return <ServiceViewPage id={id} />;
}
