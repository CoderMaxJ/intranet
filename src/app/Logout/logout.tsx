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
      <button
        className="block hover:bg-gray-100"
        onClick={triggerLogout }
        style={{boxShadow:'none', outline:'none', background:'none', border:'none'}}
      >
        Log Out
      </button>
    </div>
  );
}
