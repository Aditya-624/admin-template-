"use client";

import React, { useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

// Placeholder data matching the screenshot
const placeholderData = [
  { id: 1, name: "Airi Satou", position: "Accountant", office: "Tokyo", age: 33, startDate: "2008/11/28", salary: "$162,700" },
  { id: 2, name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47, startDate: "2009/10/09", salary: "$1,200,000" },
  { id: 3, name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, startDate: "2009/01/12", salary: "$86,000" },
  { id: 4, name: "Bradley Greer", position: "Software Engineer", office: "London", age: 41, startDate: "2012/10/13", salary: "$132,000" },
  { id: 5, name: "Brenden Wagner", position: "Software Engineer", office: "San Francisco", age: 28, startDate: "2011/06/07", salary: "$206,850" },
  { id: 6, name: "Brielle Williamson", position: "Integration Specialist", office: "New York", age: 61, startDate: "2012/12/02", salary: "$372,000" },
  { id: 7, name: "Bruno Nash", position: "Software Engineer", office: "London", age: 38, startDate: "2011/05/03", salary: "$163,500" },
  { id: 8, name: "Caesar Vance", position: "Pre-Sales Support", office: "New York", age: 21, startDate: "2011/12/12", salary: "$106,450" },
  { id: 9, name: "Cara Stevens", position: "Sales Assistant", office: "New York", age: 46, startDate: "2011/12/06", salary: "$145,600" },
  { id: 10, name: "Cedric Kelly", position: "Senior Javascript Developer", office: "Edinburgh", age: 22, startDate: "2012/03/29", salary: "$433,060" },
];

export default function UserListPage() {
  const [entries, setEntries] = useState("10");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-full min-h-screen" style={{ padding: "16px 24px" }}>
      {/* Table Container covering the total page */}
      <div className="flex-1 flex flex-col w-full bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden backdrop-blur-xl" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
        
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span>Show</span>
            <div className="relative">
              <select
                value={entries}
                onChange={(e) => setEntries(e.target.value)}
                className="appearance-none bg-black/20 border border-white/[0.1] text-white py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0 text-sm text-slate-300">
            <span>Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/20 border border-white/[0.1] text-white px-3 py-1.5 rounded-lg outline-none focus:border-indigo-500/50 min-w-[200px]"
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3.5 px-4 text-[13px] font-bold text-white cursor-pointer hover:bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    Name <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white cursor-pointer hover:bg-white/[0.02] border-l border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    Position <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white cursor-pointer hover:bg-white/[0.02] border-l border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    Office <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white cursor-pointer hover:bg-white/[0.02] border-l border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    Age <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white cursor-pointer hover:bg-white/[0.02] border-l border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    Start date <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white cursor-pointer hover:bg-white/[0.02] border-l border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    Salary <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {placeholderData.map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors ${
                    index % 2 === 0 ? "bg-white/[0.01]" : ""
                  }`}
                >
                  <td className="py-3.5 px-4 text-[14px] text-slate-200">{row.name}</td>
                  <td className="py-3.5 px-4 text-[14px] text-slate-200">{row.position}</td>
                  <td className="py-3.5 px-4 text-[14px] text-slate-200">{row.office}</td>
                  <td className="py-3.5 px-4 text-[14px] text-slate-200">{row.age}</td>
                  <td className="py-3.5 px-4 text-[14px] text-slate-200">{row.startDate}</td>
                  <td className="py-3.5 px-4 text-[14px] text-slate-200">{row.salary}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/[0.08]">
                <th className="py-3.5 px-4 text-[13px] font-bold text-white">Name</th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white border-l border-white/[0.04]">Position</th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white border-l border-white/[0.04]">Office</th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white border-l border-white/[0.04]">Age</th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white border-l border-white/[0.04]">Start date</th>
                <th className="py-3.5 px-4 text-[13px] font-bold text-white border-l border-white/[0.04]">Salary</th>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-white/[0.08]">
          <div className="text-[13px] text-slate-400">
            Showing 1 to 10 of 57 entries
          </div>
          <div className="flex items-center gap-1 mt-4 sm:mt-0 text-[13px]">
            <button className="px-3 py-1.5 text-slate-400 bg-black/20 hover:text-white rounded-md border border-white/[0.05] transition-colors">Prev</button>
            <button className="px-3 py-1.5 text-white bg-indigo-500/20 border border-indigo-500/50 rounded-md">1</button>
            <button className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent rounded-md transition-colors">2</button>
            <button className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent rounded-md transition-colors">3</button>
            <button className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent rounded-md transition-colors">4</button>
            <button className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent rounded-md transition-colors">5</button>
            <button className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent rounded-md transition-colors">6</button>
            <button className="px-3 py-1.5 text-slate-400 bg-black/20 hover:text-white rounded-md border border-white/[0.05] transition-colors">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
