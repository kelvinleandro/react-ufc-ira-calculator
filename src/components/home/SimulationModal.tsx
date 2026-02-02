import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { Discipline } from "@/types/pdf";
import type { Course } from "@/types/course";
import {
  calculateGeneralIra,
  calculateIndividualIra,
} from "@/services/ira.service";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2, ArrowRight, User, Globe } from "lucide-react";
import MetricCard from "../MetricCard";

interface SimulationModalProps {
  disciplines: Discipline[];
  course: Course;
}

interface SimulatedCourse {
  id: number;
  name: string;
  period: string;
  creditHour: number;
  grade: number;
}

interface SimulationResult {
  currentIndividualIra: number;
  simulatedIndividualIra: number;
  currentGeneralIra: number;
  simulatedGeneralIra: number;
}

const SimulationModal = ({ disciplines, course }: SimulationModalProps) => {
  const [simulatedCourses, setSimulatedCourses] = useState<SimulatedCourse[]>(
    [],
  );
  const [nextId, setNextId] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const defaultNextPeriod = useMemo(() => {
    if (disciplines.length === 0) return "2026.1";
    const lastPeriod = disciplines.reduce(
      (max, d) => (d.period > max ? d.period : max),
      "0.0",
    );
    const [year, semester] = lastPeriod.split(".").map(Number);
    return semester === 1 ? `${year}.2` : `${year + 1}.1`;
  }, [disciplines]);

  const addNewCourse = () => {
    setSimulatedCourses([
      ...simulatedCourses,
      {
        id: simulatedCourses.length + 1,
        name: "",
        period: defaultNextPeriod,
        creditHour: 32,
        grade: 0.0,
      },
    ]);
    setNextId(nextId + 1);
  };

  const removeCourse = (id: number) => {
    setSimulatedCourses(simulatedCourses.filter((c) => c.id !== id));
  };

  const handleCourseChange = (
    id: number,
    field: keyof SimulatedCourse,
    value: string | number,
  ) => {
    setSimulatedCourses(
      simulatedCourses.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const handleSimulate = () => {
    setError(null);
    setResult(null);

    const validSimulatedCourses = simulatedCourses.filter(
      (c) =>
        c.period.trim() !== "" &&
        c.creditHour > 0 &&
        c.grade >= 0 &&
        c.grade <= 10,
    );
    if (validSimulatedCourses.length === 0) {
      setError(
        "Adicione pelo menos uma disciplina válida para simular.\nNome da cadeira é opcional.\nNotas devem estar entre 0 e 10.\nCarga horária deve ser um valor positivo.\nPeríodo deve ser da forma '2026.1'.",
      );
      return;
    }

    const futureDisciplines: Discipline[] = [];

    for (const simCourse of validSimulatedCourses) {
      futureDisciplines.push({
        name: simCourse.name,
        period: simCourse.period,
        creditHour: Number(simCourse.creditHour),
        grade: Number(simCourse.grade),
        status: Number(simCourse.grade) >= 5 ? "APROVADO MÉDIA" : "REPROVADO",
        code: "",
        symbol: "",
      });
    }

    const combinedDisciplines = [...disciplines, ...futureDisciplines];

    const currentIndividualIra = calculateIndividualIra(disciplines);
    const simulatedIndividualIra = calculateIndividualIra(combinedDisciplines);
    const currentGeneralIra = calculateGeneralIra(
      currentIndividualIra,
      course.mean,
      course.std,
    );
    const simulatedGeneralIra = calculateGeneralIra(
      simulatedIndividualIra,
      course.mean,
      course.std,
    );

    setResult({
      currentIndividualIra,
      simulatedIndividualIra,
      currentGeneralIra,
      simulatedGeneralIra,
    });
  };

  return (
    <Dialog
      onOpenChange={() => {
        setResult(null);
        setError(null);
        setSimulatedCourses([]);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          Simular IRA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto px-2 sm:px-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Simule o seu IRA
          </DialogTitle>

          <DialogDescription />
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Adicione as disciplinas que você planeja cursar, junto com a carga
            horária, o período e a nota que você espera alcançar.
          </p>
          <div className="rounded-md border">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="sm:w-[30%]">Disciplina</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>CH</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead className="w-12.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simulatedCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Input
                        placeholder="Ex: Cálculo"
                        value={course.name}
                        onChange={(e) =>
                          handleCourseChange(course.id, "name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={course.period}
                        onChange={(e) =>
                          handleCourseChange(
                            course.id,
                            "period",
                            e.target.value,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={course.creditHour}
                        onChange={(e) =>
                          handleCourseChange(
                            course.id,
                            "creditHour",
                            e.target.value,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={course.grade}
                        onChange={(e) =>
                          handleCourseChange(course.id, "grade", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button variant="outline" onClick={addNewCourse} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Disciplina
          </Button>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          {result && (
            <div className="space-y-4 pt-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-center">
                Resultados da Simulação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="Novo IRA-I"
                  value={result.simulatedIndividualIra.toFixed(4)}
                  subtitle={`Δ ${(result.simulatedIndividualIra - result.currentIndividualIra).toFixed(4)}`}
                  icon={User}
                  color="blue"
                />
                <MetricCard
                  title="Novo IRA-G"
                  value={result.simulatedGeneralIra.toFixed(3)}
                  subtitle={`Δ ${(result.simulatedGeneralIra - result.currentGeneralIra).toFixed(3)}`}
                  icon={Globe}
                  color="green"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSimulate}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Simular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimulationModal;
