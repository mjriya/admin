'use client';
import { useParams, useSearchParams } from 'next/navigation';
import ManagePostProperties from "../../../../components/ManagePostProperties";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.parentId;
  const type = params.type;
  const parentsId = searchParams.toString().split("=")[0]; // Grabs the dynamic value after '?'
  if (!type || !parentsId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-2 p-1">
      <ManagePostProperties type={type} id={id} parentsId={parentsId} />
    </div>
  );
}
