import { Decryptor } from "@/security";

export const getUserPrivilege = ()=>{
     const user_privilege: string[] = [];
     const user_hash_privilege = Decryptor(localStorage.getItem("user_privilege") || "");

  if (user_hash_privilege) {
    const array_privilege = user_hash_privilege.split(',')
    array_privilege.forEach((data) => {
      user_privilege.push(data);
    });
   
  }
   return user_privilege;
}
