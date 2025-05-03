"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const groupId = searchParams.get("groupId");
    if (groupId) {
      // Guardar como cookie (usamos cookies-next para client-side)
      setCookie("invitedGroupId", groupId, { path: "/" });
    }

    // Redirigir al login
    router.push("/auth/login");
  }, [router, searchParams]);

  return <p className="text-center mt-10 text-gray-700">Redirigiendo al login...</p>;
}
