import { Decryptor } from "@/security";

export function IdentifyUser(data: string | null | undefined): string[] {

  if (data) {
    const decrypted_data = Decryptor(data);
    const split_privilege = decrypted_data.split(",");

    return split_privilege;
  }

  return [];
}
