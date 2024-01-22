import React from 'react';
import { Ghost } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">Hi, Welcome back 👋</h2>
      <div className="flex items-center">
        <h2 className="text-3xl font-bold tracking-tight mr-3">
          This Show You The Dashboard Page
        </h2>
        <Ghost />
      </div>
    </>
  );
}
