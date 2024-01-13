import { Box, Card, Text, useBoolean } from "@chakra-ui/react";
import cn from "classnames";

import { formatCurrency } from "@/lib";
import { BillFrequencyLabels, BillOption } from "@/model";

import { EditBillOption } from "./EditBillOption";

export function BillOptionDisplay({ billOption }: { billOption: BillOption }) {
  const [isLoading, setIsLoading] = useBoolean();

  return (
    <Card
      key={billOption.id}
      className={cn("flex flex-row items-center justify-between p-4", {
        "filter grayscale opacity-60": isLoading,
      })}
      color="prim.500"
    >
      <Box as="span" className="flex flex-col gap-2">
        <Text as="span" fontSize="medium">
          <b>{BillFrequencyLabels[billOption.interval]}</b>
        </Text>

        <Text as="span" fontSize="large">
          {formatCurrency(billOption.price)}
        </Text>
      </Box>

      <Box>
        <EditBillOption
          billOption={billOption}
          onSubmit={setIsLoading.on}
          ButtonProps={{ isDisabled: isLoading }}
        />
      </Box>
    </Card>
  );
}
