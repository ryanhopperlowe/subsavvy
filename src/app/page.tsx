"use client";
import { trpc } from "@/lib";
import { useState } from "react";

export default function Home() {
  const getUsers = trpc.getUsers.useQuery();
  const users = getUsers.data;

  const addUser = trpc.addUser.useMutation();
  const removeUser = trpc.removeUser.useMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {users?.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <button
            onClick={() =>
              removeUser.mutateAsync(user.id).then(() => getUsers.refetch())
            }
          >
            remove
          </button>
        </div>
      ))}
      <form>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="submit"
          onClick={async (e) => {
            e.preventDefault();
            await addUser.mutateAsync({
              name,
              email,
              phone,
            });
            const x = await getUsers.refetch();
            setName("");
            setEmail("");
            setPhone("");
          }}
        >
          Create User
        </button>
      </form>
    </main>
  );
}
