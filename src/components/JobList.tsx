
import React from 'react';
import { PostJob } from '@/data/postJobs';
import { FindJob } from '@/data/findJobs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PostJobListProps {
  jobs: PostJob[];
}

interface FindJobListProps {
  jobs: FindJob[];
}

export const PostJobList: React.FC<PostJobListProps> = ({ jobs }) => {
  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Job ID</TableHead>
            <TableHead>ชื่อ-นามสกุล</TableHead>
            <TableHead>อีเมล</TableHead>
            <TableHead>ประเภทงาน</TableHead>
            <TableHead>รายละเอียดงาน</TableHead>
            <TableHead>เงินเดือน</TableHead>
            <TableHead>วันที่</TableHead>
            <TableHead>เวลาเริ่ม-สิ้นสุด</TableHead>
            <TableHead>จังหวัด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.job_id} className="hover:bg-muted transition-colors">
              <TableCell className="font-medium">{job.job_id}</TableCell>
              <TableCell>{job.first_name} {job.last_name}</TableCell>
              <TableCell>{job.email}</TableCell>
              <TableCell>{job.job_type}</TableCell>
              <TableCell>{job.job_detail}</TableCell>
              <TableCell>{job.salary.toLocaleString()} บาท</TableCell>
              <TableCell>{job.job_date}</TableCell>
              <TableCell>{job.start_time} - {job.end_time}</TableCell>
              <TableCell>{job.province}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const FindJobList: React.FC<FindJobListProps> = ({ jobs }) => {
  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Job ID</TableHead>
            <TableHead>ชื่อ-นามสกุล</TableHead>
            <TableHead>อีเมล</TableHead>
            <TableHead>ประเภทงาน</TableHead>
            <TableHead>ทักษะ</TableHead>
            <TableHead>วันที่</TableHead>
            <TableHead>เวลาเริ่ม-สิ้นสุด</TableHead>
            <TableHead>จังหวัด</TableHead>
            <TableHead>เงินเดือน (บาท)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.findjob_id} className="hover:bg-muted transition-colors">
              <TableCell className="font-medium">{job.findjob_id}</TableCell>
              <TableCell>{job.first_name} {job.last_name}</TableCell>
              <TableCell>{job.email}</TableCell>
              <TableCell>{job.job_type}</TableCell>
              <TableCell>{job.skills}</TableCell>
              <TableCell>{job.job_date}</TableCell>
              <TableCell>{job.start_time} - {job.end_time}</TableCell>
              <TableCell>{job.province}</TableCell>
              <TableCell>{job.start_salary.toLocaleString()} - {job.range_salary.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
