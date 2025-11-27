// "use client";

// export default function LoginButton() {
//   return (
//     <a
//       href="/auth/login"
//       className="button login"
//     >
//       Log In
//     </a>
//   );
// }``


"use client";

import { Button } from "@/components/ui/Button";

export default function LoginButton() {
  return (
    <Button
      variant="primary"
      size="md"
      onClick={() => window.location.href = '/auth/login'}
    >
      Log In
    </Button>
  );
}
