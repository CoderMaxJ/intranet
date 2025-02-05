"useclient";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Logout() {
  const router = useRouter();

  const triggerLogout = () => {
    router.push("/");
    localStorage.clear();
  };

  return (
    <div>
      <Link
        href="/"
        className="block px-4 py-2 hover:bg-gray-100"
        onClick={triggerLogout}
      >
        Log Out
      </Link>
    </div>
  );
}
