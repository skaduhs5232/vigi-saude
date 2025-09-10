import React from "react";
import { useParams } from "react-router-dom";
import { ModalidadeForm } from "@/components/forms/ModalidadeForm";

export default function FormModalidade() {
  const { modalidade } = useParams<{ modalidade: string }>();
  const raw = (modalidade || "padrao").toLowerCase();
  const slugMap: Record<string,string> = {
    "erros-medicacao": "erro-medicacao",
    "farmacovigilancia": "reacao-adversa",
    "reacao-medicamento": "reacao-adversa",
    "reacao-adversa-medicamento": "reacao-adversa",
  };
  const m = slugMap[raw] || raw;
  return (
    <div className="min-h-screen w-full bg-background">
      <ModalidadeForm modalidade={m} />
    </div>
  );
}
