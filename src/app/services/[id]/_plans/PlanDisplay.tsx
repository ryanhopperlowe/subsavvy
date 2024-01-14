import { Box, Button, Text, useBoolean } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import cn from "classnames";
import { useState } from "react";

import { LoadingSpinner } from "@/components";
import { BillOption, PlanWithBillOptions } from "@/model";
import { usePlanLoadState, usePlanShowStore } from "@/store";

import { BillOptionDisplay, EditBillOption } from "../_billOptions";

import { DeletePlan } from "./DeletePlan";
import { EditPlan } from "./EditPlan";

export function PlanDisplay({ plan }: { plan: PlanWithBillOptions }) {
  const {
    isLoading,
    addBillOption,
    cancelLoading,
    initiateLoading,
    addedBillOption,
  } = usePlanLoadState(plan.id);

  return (
    <Card
      key={plan.id}
      className={cn("p-4 flex flex-col gap-4", {
        "filter grayscale opacity-60": isLoading,
      })}
      bg="prim.900"
    >
      <Box className="w-full flex justify-between items-center gap-4">
        <Text
          as="span"
          fontSize="large"
          color="prim.500"
          className="flex gap-4 items-center"
        >
          {isLoading && <LoadingSpinner inline size="md" />}
          <b>{plan.name}</b>
        </Text>

        <Box className="flex gap-2">
          <EditPlan
            plan={plan}
            onSubmit={initiateLoading}
            isDisabled={isLoading}
            onError={cancelLoading}
          />

          <DeletePlan
            plan={plan}
            onSubmit={initiateLoading}
            onError={cancelLoading}
            isDisabled={isLoading}
          />
        </Box>
      </Box>

      <Text fontSize="small">{plan.description}</Text>

      <Box>
        <Text fontSize="medium" color="prim.500">
          Bill Options:
        </Text>

        <Box className="flex flex-col gap-2">
          {plan.billOptions.map((billOption) => (
            <BillOptionDisplay key={billOption.id} billOption={billOption} />
          ))}

          {addedBillOption && (
            <BillOptionDisplay billOption={addedBillOption} />
          )}

          <EditBillOption planId={plan.id} onSubmit={addBillOption} />
        </Box>
      </Box>
    </Card>
  );
}
