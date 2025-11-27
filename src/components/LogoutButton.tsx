// "use client";

// export default function LogoutButton() {
//   return (
//     <a
//       href="/auth/logout"
//       className="button logout"
//     >
//       Log Out
//     </a>
//   );
// }




















"use client";

import { Button } from "@/components/ui/Button";

export default function LogoutButton() {
  return (
    <Button
      variant="secondary"
      size="md"
      onClick={() => window.location.href = '/auth/logout'}
    >
      Log Out
    </Button>
  );
}
