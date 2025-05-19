
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
      {children}
    </div>
  );
};

export default AuthCard;
