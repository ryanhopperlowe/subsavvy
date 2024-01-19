"use client";

import { useParams } from "next/navigation";

import { PlanCreatePage } from "./PlanCreatePage";

export default function Page() {
  const { id } = useParams();
  return <PlanCreatePage serviceId={id as string} />;
}
