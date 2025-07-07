import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}
