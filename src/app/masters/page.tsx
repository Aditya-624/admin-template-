"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  User,
  Shield,
  Layers,
  Building2,
  Contact,
  GraduationCap,
  BookOpen,
  MapPin,
  ChevronRight,
} from "lucide-react";

const masterModules = [
  {
    href: "/masters/usertype-list",
    label: "User Types",
    desc: "Define system roles, classifications, and user categories.",
    icon: Users,
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-400",
    badge: "System Roles",
  },
  {
    href: "/masters/user-list",
    label: "Users",
    desc: "Manage credentials, system administrators, and staff profiles.",
    icon: User,
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    badge: "Users Management",
  },
  {
    href: "/masters/privileges-list",
    label: "Privileges",
    desc: "Configure standard system features and explicit access levels.",
    icon: Shield,
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
    badge: "Security",
  },
  {
    href: "/masters/modules-list",
    label: "Modules",
    desc: "Set up and govern major functional components of the system.",
    icon: Layers,
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-400",
    badge: "System Units",
  },
  {
    href: "/masters/clients",
    label: "Clients",
    desc: "Manage registered customer profiles, credentials, and settings.",
    icon: Building2,
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    badge: "Profiles",
  },
  {
    href: "/masters/contacts",
    label: "Contacts",
    desc: "Manage representatives, key stakeholders, and phone details.",
    icon: Contact,
    color: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-400",
    badge: "Directory",
  },
  {
    href: "/masters/courses/course-type",
    label: "Course Types",
    desc: "Classify primary program frameworks and educational types.",
    icon: GraduationCap,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    badge: "Academic Tracks",
  },
  {
    href: "/masters/courses/course",
    label: "Courses",
    desc: "Configure subject descriptions, structures, and curricula details.",
    icon: BookOpen,
    color: "from-orange-500/20 to-rose-500/20",
    iconColor: "text-orange-400",
    badge: "Curriculum",
  },
  {
    href: "/masters/branches",
    label: "Branches",
    desc: "Administer regional centers, branches, and active locales.",
    icon: MapPin,
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
    badge: "Locations",
  },
  {
    href: "/masters/subjects",
    label: "Subjects",
    desc: "Create and manage academic subjects and curricula.",
    icon: BookOpen,
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
    badge: "Academic",
  },
];

export default function MastersDirectoryPage() {
  return (
    <div className="page-content animate-fade-in" style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      <style jsx global>{`
        .masters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }
        @media (max-width: 640px) {
          .masters-grid {
            grid-template-columns: 1fr;
          }
        }
        .masters-card {
          position: relative;
          background: rgba(30, 36, 54, 0.45);
          backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          cursor: pointer;
        }
        .masters-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
          opacity: 1;
          transition: opacity 0.3s;
        }
        .masters-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          background: rgba(30, 36, 54, 0.6);
        }
        .masters-card:hover .icon-box {
          transform: scale(1.1) rotate(2deg);
        }
        .masters-card:hover .arrow-indicator {
          transform: translateX(4px);
          color: white;
        }
        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .arrow-indicator {
          transition: transform 0.2s ease, color 0.2s ease;
        }
      `}</style>

      {/* Header section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontSize: "2rem" }}>
            Masters Console
          </h1>
          <p className="text-slate-400 mt-2 text-md max-w-2xl">
            Access and configure core directories and relationship mappings for the enterprise system.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 w-fit">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          9 Active Master Schemes
        </div>
      </div>

      {/* Grid container */}
      <div className="masters-grid">
        {masterModules.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
              <div className="masters-card h-full group">
                <div>
                  {/* Top line with Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`icon-box bg-gradient-to-br ${item.color}`}>
                      <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-white/[0.04] border border-white/[0.08] text-slate-400 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  {/* Header Title */}
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-white transition-colors">
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 font-normal leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* Footer link line */}
                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                  <span className="tracking-wide">Launch Configurator</span>
                  <ChevronRight className="arrow-indicator w-4 h-4 text-slate-500" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
