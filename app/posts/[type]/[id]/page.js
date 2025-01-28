'use client';
import { useParams } from 'next/navigation';
import ManagePostProperties from "../../../../components/ManagePostProperties";

export default function PostDetailsPage() {
  const params = useParams();
  const type = params.type;
  const id = params.id;

  if (!type || !id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-2 p-1">
      <ManagePostProperties type={type} id={id} />
    </div>
  );
}
