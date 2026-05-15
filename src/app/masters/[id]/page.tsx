"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award, Users, BookOpen, Star } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

// Mock data for masters - in a real app, this would come from an API
const mastersData = {
  1: {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Mathematics Master",
    avatar: "SJ",
    status: "online",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    joinDate: "January 2020",
    experience: "8 years",
    students: 1247,
    courses: 15,
    rating: 4.9,
    specializations: ["Calculus", "Linear Algebra", "Statistics", "Discrete Mathematics"],
    bio: "Dr. Sarah Johnson is a renowned mathematician with over 8 years of teaching experience. She specializes in advanced calculus and has published numerous papers in mathematical journals. Her passion for making complex mathematical concepts accessible to students has earned her multiple teaching awards.",
    achievements: [
      "Best Mathematics Teacher Award 2023",
      "Published 12 research papers",
      "PhD in Pure Mathematics",
      "TEDx Speaker on Math Education"
    ],
    recentCourses: [
      { title: "Advanced Calculus", students: 89, rating: 4.8 },
      { title: "Linear Algebra Fundamentals", students: 156, rating: 4.9 },
      { title: "Statistics for Data Science", students: 203, rating: 4.7 }
    ]
  },
  2: {
    id: 2,
    name: "Prof. Michael Chen",
    role: "Physics Master",
    avatar: "MC",
    status: "offline",
    email: "michael.chen@university.edu",
    phone: "+1 (555) 234-5678",
    location: "California, USA",
    joinDate: "March 2019",
    experience: "10 years",
    students: 2156,
    courses: 22,
    rating: 4.8,
    specializations: ["Quantum Physics", "Thermodynamics", "Electromagnetism", "Nuclear Physics"],
    bio: "Professor Michael Chen brings a decade of physics teaching experience to our platform. His research in quantum computing has been featured in leading scientific journals. He believes in hands-on learning and has designed numerous laboratory experiments for online students.",
    achievements: [
      "Excellence in Physics Education Award 2022",
      "NSF Research Grant Recipient",
      "Author of 'Quantum Physics for Beginners'",
      "International Physics Olympiad Coach"
    ],
    recentCourses: [
      { title: "Quantum Mechanics Basics", students: 234, rating: 4.9 },
      { title: "Thermodynamics Principles", students: 178, rating: 4.6 },
      { title: "Electromagnetic Theory", students: 145, rating: 4.8 }
    ]
  },
  3: {
    id: 3,
    name: "Dr. Emma Davis",
    role: "Chemistry Master",
    avatar: "ED",
    status: "online",
    email: "emma.davis@university.edu",
    phone: "+1 (555) 345-6789",
    location: "Texas, USA",
    joinDate: "September 2021",
    experience: "6 years",
    students: 987,
    courses: 12,
    rating: 4.7,
    specializations: ["Organic Chemistry", "Biochemistry", "Analytical Chemistry", "Physical Chemistry"],
    bio: "Dr. Emma Davis is passionate about making chemistry exciting and accessible. With 6 years of teaching experience, she has developed innovative ways to demonstrate complex chemical reactions through virtual labs and interactive simulations.",
    achievements: [
      "Young Scientist Award 2023",
      "Chemistry Education Innovation Prize",
      "MS in Chemistry Education",
      "Virtual Lab Developer"
    ],
    recentCourses: [
      { title: "Organic Chemistry Fundamentals", students: 167, rating: 4.8 },
      { title: "Biochemistry Essentials", students: 134, rating: 4.6 },
      { title: "Analytical Chemistry Methods", students: 98, rating: 4.7 }
    ]
  },
  4: {
    id: 4,
    name: "Prof. Alex Rodriguez",
    role: "Biology Master",
    avatar: "AR",
    status: "away",
    email: "alex.rodriguez@university.edu",
    phone: "+1 (555) 456-7890",
    location: "Florida, USA",
    joinDate: "February 2018",
    experience: "12 years",
    students: 3241,
    courses: 28,
    rating: 4.9,
    specializations: ["Molecular Biology", "Genetics", "Ecology", "Microbiology"],
    bio: "Professor Alex Rodriguez has been teaching biology for 12 years and is known for his engaging field trips and research projects. His work in marine biology has taken him to research stations around the world, bringing real-world experiences to his students.",
    achievements: [
      "Biology Teacher of the Year 2021",
      "Marine Biology Research Fellow",
      "Author of 'Biology in the Modern World'",
      "Environmental Education Advocate"
    ],
    recentCourses: [
      { title: "Molecular Biology", students: 289, rating: 4.9 },
      { title: "Genetics and Heredity", students: 245, rating: 4.8 },
      { title: "Marine Biology", students: 198, rating: 4.7 }
    ]
  },
  5: {
    id: 5,
    name: "Dr. Lisa Wang",
    role: "Computer Science Master",
    avatar: "LW",
    status: "online",
    email: "lisa.wang@university.edu",
    phone: "+1 (555) 567-8901",
    location: "Washington, USA",
    joinDate: "June 2022",
    experience: "5 years",
    students: 756,
    courses: 10,
    rating: 4.8,
    specializations: ["Algorithms", "Data Structures", "Machine Learning", "Web Development"],
    bio: "Dr. Lisa Wang is a computer scientist with expertise in artificial intelligence and machine learning. She has worked at leading tech companies before transitioning to education. Her courses combine theoretical foundations with practical coding projects.",
    achievements: [
      "AI Research Excellence Award 2023",
      "Former Google AI Researcher",
      "Open Source Contributor",
      "Coding Bootcamp Instructor"
    ],
    recentCourses: [
      { title: "Algorithms and Data Structures", students: 312, rating: 4.9 },
      { title: "Machine Learning Fundamentals", students: 267, rating: 4.8 },
      { title: "Full-Stack Web Development", students: 189, rating: 4.7 }
    ]
  }
};

export default function MasterProfilePage({ params }: { params: { id: string } }) {
  const masterId = parseInt(params.id);
  const master = mastersData[masterId as keyof typeof mastersData];

  if (!master) {
    return (
      <div className="page-content animate-fade-in">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">Master Not Found</h1>
          <p className="text-slate-400">The requested master profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <motion.div {...fadeUp()} className="flex items-center gap-4 mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </motion.div>

      {/* Profile Header */}
      <motion.div {...fadeUp(0.1)} className="glass-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {master.avatar}
            </div>
            <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-gray-900 ${
              master.status === 'online' ? 'bg-green-400' :
              master.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
            }`}></div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{master.name}</h1>
            <p className="text-xl text-indigo-400 font-medium mb-4">{master.role}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {master.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {master.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {master.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {master.joinDate}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{master.students.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{master.courses}</div>
              <div className="text-sm text-slate-400">Courses</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-white">{master.rating}</span>
              </div>
              <div className="text-sm text-slate-400">Rating</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio Section */}
          <motion.div {...fadeUp(0.2)} className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-slate-300 leading-relaxed">{master.bio}</p>
          </motion.div>

          {/* Specializations */}
          <motion.div {...fadeUp(0.3)} className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {master.specializations.map((spec, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
                  {spec}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Recent Courses */}
          <motion.div {...fadeUp(0.4)} className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Courses</h2>
            <div className="space-y-4">
              {master.recentCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">{course.title}</h3>
                    <p className="text-sm text-slate-400">{course.students} students enrolled</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{course.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Achievements */}
          <motion.div {...fadeUp(0.5)} className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Achievements
            </h2>
            <div className="space-y-3">
              {master.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-300 text-sm">{achievement}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div {...fadeUp(0.6)} className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Experience</span>
                <span className="text-white font-medium">{master.experience}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Students</span>
                <span className="text-white font-medium">{master.students.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Courses Created</span>
                <span className="text-white font-medium">{master.courses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Average Rating</span>
                <span className="text-white font-medium">{master.rating}/5.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}