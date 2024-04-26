"use client";

import { useEffect } from "react";
import { PAGE_ROUTES } from "@/config/constants";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(PAGE_ROUTES.floorPlanList);
  }, [router]);
}
