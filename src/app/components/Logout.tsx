"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="logout-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
    >
      Logout
    </button>
  );
}

//
//
//
//SHOW ONLY WHEN LOGGED IN

// "use client";

// import { signOut, useSession } from "next-auth/react";

// export default function LogoutButton() {
//   const { data: session } = useSession();

//   if (!session) return null;

//   return (
//     <button
//       onClick={() => signOut({ callbackUrl: "/" })}
//       className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//     >
//       Logout ({session.user?.name})
//     </button>
//   );
// }
