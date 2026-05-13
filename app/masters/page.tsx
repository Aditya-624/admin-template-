import Link from "next/link";
import { Mail, Phone, MapPin, Star, Users } from "lucide-react";

const mastersUsers = [
  { id: 1, name: "Dr. Sarah Johnson", role: "Mathematics Master", avatar: "SJ", status: "online" },
  { id: 2, name: "Prof. Michael Chen", role: "Physics Master", avatar: "MC", status: "offline" },
  { id: 3, name: "Dr. Emma Davis", role: "Chemistry Master", avatar: "ED", status: "online" },
  { id: 4, name: "Prof. Alex Rodriguez", role: "Biology Master", avatar: "AR", status: "away" },
  { id: 5, name: "Dr. Lisa Wang", role: "Computer Science Master", avatar: "LW", status: "online" },
];

export default function MastersDirectoryPage() {
  return (
    <div className="page-content animate-fade-in">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">User List</h1>
          <p className="text-slate-400 mt-1">Select a master to open their profile.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-300">
          <Users className="w-4 h-4 text-indigo-400" />
          <span className="text-sm">{mastersUsers.length} users</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mastersUsers.map((master) => (
          <Link
            key={master.id}
            href={`/masters/${master.id}`}
            className="group glass-card p-5 rounded-2xl hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                  {master.avatar}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-gray-900 ${
                    master.status === "online"
                      ? "bg-green-400"
                      : master.status === "away"
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white truncate">{master.name}</h2>
                <p className="text-sm text-indigo-300 mt-0.5">{master.role}</p>

                <div className="mt-3 space-y-2 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm truncate">{master.name.toLowerCase().replace(/\s+/g, "")}
                      @example.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">+1 (555) 000-{String(master.id).padStart(2, "0")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">Worldwide</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">View profile</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-300 text-sm">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

