import { RootService } from "./RootService";
import { UserCreate, UserUpdate } from "@/model";

export class UserService extends RootService {
  async findMany() {
    return await this.db.user.findMany();
  }

  async findByEmail(email: string) {
    return await this.db.user.findUnique({
      where: { email },
    });
  }

  async create(email: string, data: UserCreate) {
    return await this.db.user.create({
      data: {
        email,
        ...data,
      },
    });
  }

  async update(data: UserUpdate) {
    return await this.db.user.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: number) {
    return await this.db.user.delete({
      where: { id },
    });
  }
}
