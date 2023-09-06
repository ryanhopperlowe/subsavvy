import { ApiRoutes } from "@/routes";

type User = {
  UserId: number;
  Name: string;
  Email: string;
  CreatedAt: string; // Date;
  UpdatedAt: string; // Date;
  Phone: string;
};

export default async function Home() {
  console.log("homepage");

  const response = await fetch(ApiRoutes.usersApi.api());
  const json = await response.json();
  const users: User[] = json.users;
  console.log(users);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {users.map((user) => (
        <div key={user.UserId}>
          <p>{user.Name}</p>
          <p>{user.Email}</p>
          <p>{user.Phone}</p>
        </div>
      ))}
    </main>
  );
}
