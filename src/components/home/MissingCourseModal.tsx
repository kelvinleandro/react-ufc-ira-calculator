import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { suggestCourse } from "@/services/firebase.service";
import { notifyCourseSuggestion } from "@/services/discord.service";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const MissingCourseModal = () => {
  const [courseName, setCourseName] = useState("");
  const [mean, setMean] = useState("");
  const [std, setStd] = useState("");
  const [proof, setProof] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2MB.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProof("");
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!courseName || !mean || !std || !proof) {
      alert("Por favor, preencha todos os campos e anexe o comprovante.");
      return;
    }

    const meanValue = parseFloat(mean);
    const stdValue = parseFloat(std);

    if (isNaN(meanValue) || isNaN(stdValue)) {
      alert("Média e Desvio Padrão devem ser números.");
      return;
    }

    setIsSubmitting(true);
    try {
      const courseData = {
        name: courseName,
        mean: meanValue,
        std: stdValue,
        proof: proof,
      };
      
      await suggestCourse(courseData);
      
      // Send notification to discord
      notifyCourseSuggestion(courseData);
      
      alert("Sugestão enviada com sucesso!");
      setCourseName("");
      setMean("");
      setStd("");
      setProof("");
      setOpen(false); // Close the dialog on success
    } catch (error) {
      console.error("Error suggesting course:", error);
      alert("Erro ao enviar sugestão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          Meu curso não está na lista 🥲😭
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Seu curso não está na lista?
          </DialogTitle>

          <DialogDescription>
            Sugira o seu curso através do formulário abaixo, inserindo o nome do
            curso, a média e o desvio padrão com base no semestre mais recente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="courseName">Nome do Curso</Label>
            <Input
              id="courseName"
              placeholder="Ex: Ciência da Computação"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mean">Média</Label>
            <Input
              id="mean"
              type="number"
              step="0.01"
              placeholder="Ex: 7.5"
              value={mean}
              onChange={(e) => setMean(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="std">Desvio Padrão</Label>
            <Input
              id="std"
              type="number"
              step="0.01"
              placeholder="Ex: 1.2"
              value={std}
              onChange={(e) => setStd(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proof">Print do IRA do curso no Sigaa</Label>
            <Input
              id="proof"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Sugerir Curso"}
          </Button>
          <DialogClose asChild>
            <button ref={closeRef} className="hidden"></button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissingCourseModal;
