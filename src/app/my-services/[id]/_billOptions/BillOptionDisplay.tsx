import { Box, Card, Text, useBoolean } from "@chakra-ui/react";
import cn from "classnames";

import { LoadingSpinner } from "@/components";
import { formatCurrency } from "@/lib";
import { BillFrequencyLabels, BillOption } from "@/model";
import { useBillOptionLoadState } from "@/store";

import { DeleteBillOption } from "./DeleteBillOption";
import { EditBillOption } from "./EditBillOption";

export function BillOptionDisplay({
  billOption,
  canDelete,
  canEdit,
}: {
  billOption: BillOption;
  canDelete?: boolean;
  canEdit?: boolean;
}) {
  const { isLoading, initiateLoading, cancelLoading } = useBillOptionLoadState(
    billOption.id,
  );

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
        {canEdit && (
          <EditBillOption
            billOption={billOption}
            onSubmit={initiateLoading}
            onError={cancelLoading}
            ButtonProps={{ isDisabled: isLoading }}
          />
        )}

        {canDelete && (
          <DeleteBillOption
            billOption={billOption}
            isDisabled={isLoading}
            onSubmit={initiateLoading}
            onError={cancelLoading}
          />
        )}

        {isLoading && <LoadingSpinner inline size="md" />}
      </Box>
    </Card>
  );
}
