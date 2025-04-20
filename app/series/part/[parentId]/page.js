'use client';
import { usePathname } from 'next/navigation';
import ManagePostProperties from "../../../../components/ManagePostProperties";

export default function Page() {
  const pathname = usePathname();

  const id = pathname.split("/")[3];
  const parentsId = pathname.split("/")[2]; // Grabs the dynamic value after '?'
  if (!type || !parentsId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-2 p-1">
      <SeriesManagePostProperties  id={id} parentsId={parentsId} />
    </div>
  );
}
