import MainLayout from "@/components/layout/MainLayout";
import Tex from "@/components/Tex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BookOpen } from "lucide-react";

const About = () => {
  const cardStyle = {
    card: "mb-8 border-border bg-card shadow-card animate-fade-in",
    cardHeader: "flex items-center gap-3 text-xl",
    iconStyle: "h-6 w-6 text-primary",
    content: "space-y-4 text-muted-foreground leading-relaxed",
  };

  const individualIraMeaning = [
    {
      label: "T",
      description: (
        <>
          Somatório da carga horária de todas as disciplinas{" "}
          <strong className="text-foreground">trancadas</strong>.
        </>
      ),
    },
    {
      label: "C",
      description: (
        <>
          Somatório da carga horária de todas as disciplinas{" "}
          <strong className="text-foreground">cursadas ou trancadas</strong>.
        </>
      ),
    },
    {
      label: (
        <>
          N<sub>i</sub>
        </>
      ),
      description: 'Nota final obtida na disciplina "i"',
    },
    {
      label: (
        <>
          C<sub>i</sub>
        </>
      ),
      description: 'Carga horária da disciplina "i"',
    },
    {
      label: (
        <>
          P<sub>i</sub>
        </>
      ),
      description:
        'Peso referente ao período em que a disciplina "i" foi cursada. Este peso varia de 1 (no primeiro semestre) até um limite máximo de 6.',
    },
  ];

  const generalIraMeaning = [
    {
      label: (
        <>
          IRA<sub>m</sub>
        </>
      ),
      description:
        "Média dos IRAs Individuais dos alunos ativos do curso no semestre.",
    },
    {
      label: (
        <>
          IRA<sub>dp</sub>
        </>
      ),
      description:
        "Desvio padrão dos IRAs Individuais dos alunos ativos do curso no semestre.",
    },
  ];

  return (
    <MainLayout>
      <div className=" mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12 text-center animate-fade-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary">
            <Calculator className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Sobre o Índice de Rendimento Acadêmico (IRA)
          </h1>
        </div>

        <Card className={cardStyle.card}>
          <CardHeader>
            <CardTitle className={cardStyle.cardHeader}>
              <BookOpen className={cardStyle.iconStyle} />O que é o IRA?
            </CardTitle>
          </CardHeader>
          <CardContent className={cardStyle.content}>
            <p>
              O{" "}
              <strong className="text-foreground">
                Índice de Rendimento Acadêmico (IRA)
              </strong>{" "}
              é a métrica oficial da Universidade Federal do Ceará (UFC) para
              avaliar o desempenho dos estudantes. Ele é dividido em duas
              modalidades com propósitos distintos: o{" "}
              <strong className="text-foreground">IRA Individual</strong> e o{" "}
              <strong className="text-foreground">IRA Geral</strong>.
            </p>
          </CardContent>
        </Card>

        <Card className={cardStyle.card}>
          <CardHeader>
            <CardTitle className={cardStyle.cardHeader}>
              <span className="text-primary text-2xl">?</span> Qual a diferença
              entre IRA-I e IRA-G?
            </CardTitle>
          </CardHeader>
          <CardContent className={cardStyle.content}>
            <ul className="space-y-3 pl-4">
              <li>
                <strong className="text-foreground">IRA Individual:</strong>{" "}
                Reflete o desempenho acadêmico pessoal de um aluno, considerando
                suas notas, carga horária e penalidades por trancamento. É o seu
                histórico transformado em um número.
              </li>
              <li>
                <strong className="text-foreground">IRA Geral:</strong> É uma
                nota normalizada que permite uma comparação justa do desempenho
                de alunos entre diferentes cursos da universidade. Ele ajusta o
                IRA Individual com base na média e no desvio padrão da turma.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className={cardStyle.card}>
          <CardHeader>
            <CardTitle className={cardStyle.cardHeader}>
              <Calculator className={cardStyle.iconStyle} />
              IRA Individual: Medindo o Desempenho Pessoal
            </CardTitle>
          </CardHeader>
          <CardContent className={cardStyle.content}>
            <p>
              Este índice é a base para o cálculo do IRA Geral e é calculado a
              partir das notas, cargas horárias das disciplinas cursadas e um
              fator de penalidade por trancamentos.
            </p>

            <div className="rounded-lg border border-border bg-muted/50 p-6 my-6">
              <Tex
                tex="IRA_{Individual} = \left(1 - \frac{0.5 \cdot T}{C}\right) \times \left(\frac{\sum (P_i \cdot C_i \cdot N_i)}{\sum (P_i \cdot C_i)}\right)"
                className="text-foreground text-lg"
              />
            </div>

            <p>Onde:</p>
            <ul className="space-y-3 pl-4">
              {individualIraMeaning.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <strong className="text-foreground">{item.label}:</strong>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={cardStyle.card}>
          <CardHeader>
            <CardTitle className={cardStyle.cardHeader}>
              <Calculator className={cardStyle.iconStyle} />
              IRA Geral: Comparando entre Cursos
            </CardTitle>
          </CardHeader>
          <CardContent className={cardStyle.content}>
            <p>
              O objetivo do IRA Geral é posicionar o aluno em relação à sua
              própria turma. A fórmula ajusta o desempenho para uma escala onde
              a média do curso é sempre 6. Um IRA Geral de 8, por exemplo,
              indica que o aluno está um desvio padrão acima da média de seu
              curso. Os valores são limitados entre 0 e 10.
            </p>

            <div className="rounded-lg border border-border bg-muted/50 p-6 my-6">
              <Tex
                tex="IRA_{Geral} = 6 + 2 \left( \frac{IRA_{Individual} - IRA_{m}}{IRA_{dp}} \right)"
                className="text-foreground text-lg"
              />
            </div>

            <p>Onde:</p>
            <ul className="space-y-3 pl-4">
              {generalIraMeaning.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <strong className="text-foreground">{item.label}:</strong>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <p className="text-sm">
          Deseja saber mais informações sobre o IRA?{" "}
          <a
            href="https://prograd.ufc.br/pt/perguntas-frequentes/ira/"
            target="_blank"
            className="hover:text-primary font-semibold"
          >
            Clique aqui para acessar a página oficial da PROGRAD/UFC.
          </a>
        </p>
      </div>
    </MainLayout>
  );
};

export default About;
