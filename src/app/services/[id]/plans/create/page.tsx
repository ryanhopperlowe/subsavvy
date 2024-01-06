import { PlanCreatePage } from "./PlanCreatePage";

export default function Page({ id }: { id: string }) {
  return <PlanCreatePage serviceId={id} />;
}
