"use client";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import { useState } from "react";

export default function Home() {
  const [formType, setFormType] = useState<boolean>(true);

  return (
    <>
      {formType ? (
        <SignIn setFormType={setFormType} />
      ) : (
        <SignUp setFormType={setFormType} />
      )}
    </>
  );
}
