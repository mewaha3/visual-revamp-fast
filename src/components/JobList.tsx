
import React from 'react';
import { Job, FindJob } from '@/types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PostJobListProps {
  jobs: Job[];
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
            <TableHead>ค่าจ้าง</TableHead>
            <TableHead>วันที่</TableHead>
            <TableHead>เวลาทำงาน</TableHead>
            <TableHead>สถานที่</TableHead>
            <TableHead>การจัดการ</TableHead>
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
              <TableCell className="whitespace-nowrap">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                    className="text-xs"
                  >
                    <Link to={`/matching/${job.job_id}`}>ดูการจับคู่</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                    className="text-xs"
                  >
                    <Link to={`/status/${job.job_id}`}>ดูสถานะ</Link>
                  </Button>
                </div>
              </TableCell>
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
            <TableHead>เวลาทำงาน</TableHead>
            <TableHead>สถานที่</TableHead>
            <TableHead>ค่าจ้าง (บาท)</TableHead>
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
