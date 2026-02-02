import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const MissingCourseModal = () => {
  return (
    <Dialog>
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

          <DialogDescription className="sr-only">
            Sugira o seu curso através do formulário abaixo, inserindo o nome do
            curso, a média e o desvio padrão com base no semestre mais recente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground leading-relaxed">
            Posso fazer nada.
          </p>
          <img
            alt="Imagem temporária"
            src="https://media.tenor.com/8JGvSWuGdHoAAAAe/problema-meu-e-quem-disse-que-%C3%A9-problema-meu.png"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissingCourseModal;
