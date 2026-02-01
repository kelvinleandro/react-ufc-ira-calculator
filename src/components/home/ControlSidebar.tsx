import { useState } from "react";
import { Upload, GraduationCap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/types/course";

const courses: Course[] = [
  {
    value: "eng-comp",
    label: "Engenharia de Computação",
    mean: 7.270936965942383,
    std: 1.8308340311050415,
  },
  {
    value: "custom",
    label: "Customizado",
    mean: 0,
    std: 0,
  },
];

interface ControlSidebarProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCourseChange: (course: Course | null) => void;
}

const ControlSidebar = ({
  onFileChange,
  onCourseChange,
}: ControlSidebarProps) => {
  const [selectedCourseValue, setSelectedCourseValue] = useState<string>();
  const [customMean, setCustomMean] = useState("");
  const [customStd, setCustomStd] = useState("");

  const handleCourseSelection = (value: string) => {
    setSelectedCourseValue(value);
    const course = courses.find((c) => c.value === value);

    if (course) {
      if (value === "custom") {
        onCourseChange({
          value: "custom",
          label: "Customizado",
          mean: parseFloat(customMean) || 0,
          std: parseFloat(customStd) || 0,
        });
      } else {
        onCourseChange(course as Course);
      }
    } else {
      onCourseChange(null);
    }
  };

  const handleMeanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mean = e.target.value;
    setCustomMean(mean);
    onCourseChange({
      value: "custom",
      label: "Customizado",
      mean: parseFloat(mean) || 0,
      std: parseFloat(customStd) || 0,
    });
  };

  const handleStdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const std = e.target.value;
    setCustomStd(std);
    onCourseChange({
      value: "custom",
      label: "Customizado",
      mean: parseFloat(customMean) || 0,
      std: parseFloat(std) || 0,
    });
  };

  return (
    <aside className="md:min-h-[calc(100vh-4rem)] w-full md:w-72 border-r border-border gradient-sidebar p-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Controles
          </h2>
          <div className="h-px bg-border" />
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="pdf-upload"
            className="flex items-center gap-2 text-foreground"
          >
            <Upload className="h-4 w-4 text-primary" />
            Histórico Acadêmico
          </Label>
          <div className="relative">
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="cursor-pointer file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
              onChange={onFileChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Faça upload do PDF do histórico escolar
          </p>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            Curso
          </Label>
          <Select
            onValueChange={handleCourseSelection}
            value={selectedCourseValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o curso" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.value} value={course.value}>
                  {course.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourseValue === "custom" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="custom-mean">Média do curso</Label>
              <Input
                id="custom-mean"
                type="number"
                value={customMean}
                onChange={handleMeanChange}
                placeholder="Ex: 7.5"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="custom-std">Desvio padrão do curso</Label>
              <Input
                id="custom-std"
                type="number"
                value={customStd}
                onChange={handleStdChange}
                placeholder="Ex: 1.5"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ControlSidebar;
