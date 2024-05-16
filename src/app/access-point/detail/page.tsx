"use-client";
import CustomLayout from "@/components/layout/CustomLayout";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";

const AccessPointDetailPage = () => {
  const AccessPointDetailPageNoSsr = useMemo(
    () =>
      dynamic(
        () => import("@/components/client-rendered-pages/AccessPointDetailPage")
      ),
    []
  );

  return (
    <CustomLayout>
      <AccessPointDetailPageNoSsr />
    </CustomLayout>
  );
};

export default AccessPointDetailPage;
