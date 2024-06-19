"use-client";
import CustomLayout from "@/components/layout/CustomLayout";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const EditAccessPointPage = () => {
  const EditAccessPointPageNoSsr = useMemo(
    () =>
      dynamic(
        () => import("@/components/client-rendered-pages/EditAccessPointPage"),
        { ssr: false },
      ),
    [],
  );

  return (
    <CustomLayout>
      <EditAccessPointPageNoSsr />
    </CustomLayout>
  );
};

export default EditAccessPointPage;
