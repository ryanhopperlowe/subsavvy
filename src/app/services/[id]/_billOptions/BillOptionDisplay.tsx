import { Box, Card, Text, useBoolean } from "@chakra-ui/react";
import cn from "classnames";

import { LoadingSpinner } from "@/components";
import { formatCurrency } from "@/lib";
import { BillFrequencyLabels, BillOption } from "@/model";
import { usePlanShowStore } from "@/store";

import { EditBillOption } from "./EditBillOption";

export function BillOptionDisplay({ billOption }: { billOption: BillOption }) {
  const { updatedBillOption } = usePlanShowStore();

  const [isUpdating, setIsUpdating] = useBoolean();

  const isLoading = isUpdating || updatedBillOption === billOption.id;

  return (
    <Card
      key={billOption.id}
      className={cn("flex flex-row items-center justify-between p-4", {
        "filter grayscale opacity-60": isLoading,
      })}
      color="prim.500"
    >
      <Box className="flex gap-4 items-center">
        <Box as="span" className="flex flex-col gap-2">
          <Text as="span" fontSize="medium">
            <b>{BillFrequencyLabels[billOption.interval]}</b>
          </Text>

          <Text as="span" fontSize="large">
            {formatCurrency(billOption.price)}
          </Text>
        </Box>
      </Box>

      <Box className="flex gap-2 items-center">
        <EditBillOption
          billOption={billOption}
          onSubmit={setIsUpdating.on}
          ButtonProps={{ isDisabled: isLoading }}
          onComplete={setIsUpdating.off}
        />

        {isLoading && <LoadingSpinner inline size="md" />}
      </Box>
    </Card>
  );
}
