'use client';
import SeriesManagePostProperties from '../../../../../components/SeriesManagePostProperties';
import { usePathname } from 'next/navigation';

export default function Page() {
  const pathname = usePathname();

  const parentsId = pathname.split("/")[3];
  const child = pathname.split("/")[4];
  

  return (
    <div className="pt-2 p-1">
     
      <SeriesManagePostProperties child={child} parent={parentsId} />
    </div>
  );
}
