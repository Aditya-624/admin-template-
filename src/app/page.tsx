"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="page-content animate-fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Image 
          src="/nirnayah-logo.svg" 
          alt="Nirnayah Logo" 
          width={400} 
          height={400}
          style={{ width: "clamp(200px, 30vw, 400px)", height: "auto" }}
        />
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          style={{ 
            color: "rgba(255, 255, 255, 0.4)", 
            marginTop: "2rem", 
            fontSize: "1.2rem", 
            letterSpacing: "0.4em", 
            fontWeight: 500, 
            textTransform: "uppercase" 
          }}
        >
          Admin Console
        </motion.p>
      </motion.div>
    </div>
  );
}
