import React from "react";
import { useParams } from "react-router-dom";
import { ModalidadeForm } from "@/components/forms/ModalidadeForm";

export default function FormModalidade() {
  const { modalidade } = useParams<{ modalidade: string }>();
  const m = (modalidade || "padrao").toLowerCase();
  return (
    <div className="min-h-screen w-full bg-background">
      <ModalidadeForm modalidade={m} />
    </div>
  );
}
