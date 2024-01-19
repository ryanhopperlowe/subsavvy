"use client";

import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { ConfirmModal } from "@/components/shared";
import { formatDate, trpc } from "@/lib";
import { Identifier } from "@/model";
import { Routes } from "@/routes";

export default function ServiceListPage() {
  const getServices = trpc.services.getByAuthedUser.useQuery();
  const deleteService = trpc.services.delete.useMutation();

  const confirm = useDisclosure();

  const handleDelete = async (id: Identifier) => {
    await deleteService.mutateAsync(id);

    confirm.onClose();
    getServices.refetch();
  };

  const router = useRouter();

  return (
    <Box className="flex flex-col gap-4">
      {getServices.data?.map((client) => (
        <Box key={client.id} className="flex justify-between w-full">
          <Box className="flex flex-col">
            <Text>{client.name}</Text>
            <Text>{formatDate(client.createdAt)}</Text>
          </Box>

          <Box className="flex gap-2">
            <Button
              variant="outline"
              colorScheme="prim"
              onClick={() =>
                router.push(Routes.serviceView.path({ id: String(client.id) }))
              }
            >
              View
            </Button>

            <Button
              variant="outline"
              colorScheme="red"
              onClick={confirm.onOpen}
            >
              Delete
            </Button>
          </Box>

          <ConfirmModal
            isOpen={confirm.isOpen}
            onCancel={confirm.onClose}
            onConfirm={() => handleDelete(client.id)}
          >
            <Text>
              Are you sure you want to delete this service? This cannot be
              undone.
            </Text>
          </ConfirmModal>
        </Box>
      ))}
    </Box>
  );
}
