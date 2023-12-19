"use client";
import { ConfirmModal } from "@/components/shared";
import { formatDate, trpc } from "@/lib";
import { Routes } from "@/routes";
import { Box, Button, Container, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function ServiceListPage() {
  const getClients = trpc.services.getAll.useQuery();
  const deleteClient = trpc.services.delete.useMutation();

  const confirm = useDisclosure();

  const handleDelete = async (id: number) => {
    await deleteClient.mutateAsync(id);

    confirm.onClose();
    getClients.refetch();
  };

  const router = useRouter();

  return (
    <Container>
      <Box className="flex flex-col gap-4">
        {getClients.data?.map((client) => (
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
                  router.push(
                    Routes.serviceView.path({ id: String(client.id) })
                  )
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
    </Container>
  );
}
