"use client";

import logo from "@/public/images/logos/sub-logo.webp";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "./Header";

const IconHeader: React.FC = () => {
  return (
    <Header>
      <Link href="/">
        <Image src={logo} alt="logo" width={40} />
      </Link>
    </Header>
  );
};

export default IconHeader;
