import { useState, useMemo } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Rectangle,
  type BarShapeProps,
  type TooltipContentProps,
} from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IraData } from "@/types/ira";
import type { Discipline } from "@/types/pdf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AnalysisTabProps {
  iraData: IraData;
  disciplines: Discipline[];
}

const chartColors = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
};

const getBarColor = (grade: number) => {
  if (grade < 5) return "#ef4444";
  if (grade < 7) return "#f59e0b";
  return "#22c55e";
};

const truncate = (text: string, max = 22) =>
  text.length > max ? text.slice(0, max) + "…" : text;

const CustomScatterTooltip = ({
  active,
  payload,
}: TooltipContentProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;

  const { semester, hours, meanGrade } = payload[0].payload as {
    semester: string;
    hours: number;
    meanGrade: number;
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-popover)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: "8px 12px",
        color: "var(--color-popover-foreground)",
      }}
    >
      <div className="font-semibold">{semester}</div>
      <div>Carga horária: {hours} h</div>
      <div>Média: {meanGrade.toFixed(2)}</div>
    </div>
  );
};

const GradeBarShape = (props: BarShapeProps) => {
  const { payload } = props as BarShapeProps & {
    payload: Discipline;
  };

  return (
    <Rectangle
      {...props}
      fill={getBarColor(payload.grade)}
      radius={[4, 4, 4, 4]}
    />
  );
};

const AnalysisTab = ({ iraData, disciplines }: AnalysisTabProps) => {
  const isNarrow = window.innerWidth < 480;

  const uniqueSemesters = useMemo(
    () => Object.keys(iraData.semesterIra).sort(),
    [iraData.semesterIra],
  );
  const [selectedSemester, setSelectedSemester] = useState(uniqueSemesters[0]);
  const filteredDisciplines = useMemo(
    () =>
      disciplines
        .filter(
          (discipline) =>
            discipline.period === selectedSemester &&
            !["TRANCADO", "MATRICULADO", "SUPRIMIDO"].includes(
              discipline.status,
            ),
        )
        .sort((a, b) => b.grade - a.grade),
    [disciplines, selectedSemester],
  );

  const lineData = Object.entries(iraData.semesterIra).map(
    ([semester, ira]) => ({
      semester,
      ira,
      grade: iraData.meanGradePerSemester[semester],
    }),
  );

  const gradeDistribution = Object.entries(iraData.gradeDistribution).map(
    ([category, count]) => ({ category, count }),
  );

  const hoursPerSemester = Object.entries(iraData.hourlyLoad).map(
    ([semester, hours]) => ({ semester, hours }),
  );

  const scatterData = Object.entries(iraData.hourlyLoad).map(
    ([semester, hours]) => ({
      semester,
      hours,
      meanGrade: iraData.meanGradePerSemester[semester],
    }),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Evolução ao Longo do Tempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="semester"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-popover-foreground)",
                }}
                formatter={(value) =>
                  typeof value === "number" ? value.toFixed(3) : value
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ira"
                name="IRA Individual"
                stroke={chartColors.primary}
                strokeWidth={3}
                dot={{ fill: chartColors.primary, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="grade"
                name="Média de Notas"
                stroke={chartColors.secondary}
                strokeWidth={3}
                dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Distribuição de Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="category"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                  tickMargin={15}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Frequência"
                  fill={chartColors.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Carga Horária por Semestre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hoursPerSemester}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="semester"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Bar
                  dataKey="hours"
                  name="Carga Horária"
                  fill={chartColors.secondary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Carga Horária x Média de Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  type="number"
                  dataKey="hours"
                  name="Carga Horária"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                  tickMargin={15}
                  label={{
                    value: "Carga Horária (h)",
                    position: "bottom",
                    fontSize: 12,
                    fill: "var(--color-foreground)",
                    offset: -15,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="meanGrade"
                  name="Média de Notas"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  domain={[0, 10]}
                  label={{
                    value: "Média de Notas",
                    position: "insideLeft",
                    fontSize: 12,
                    fill: "var(--color-foreground)",
                    angle: -90,
                  }}
                />
                <Tooltip
                  content={(props) => <CustomScatterTooltip {...props} />}
                />
                <Scatter
                  name="Semestres"
                  data={scatterData}
                  fill={chartColors.tertiary}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <p className="flex-1">Resultados do Semestre </p>
              <Select
                onValueChange={(e) => setSelectedSemester(e)}
                value={selectedSemester}
                defaultValue={uniqueSemesters[0]}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {uniqueSemesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={filteredDisciplines}
                layout="vertical"
                margin={{ top: 20, right: 35, bottom: 20, left: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />

                <XAxis
                  type="number"
                  domain={[0, 10]}
                  label={{
                    value: "Nota",
                    position: "bottom",
                    fill: "var(--color-muted-foreground)",
                  }}
                  style={{ fill: "var(--color-muted-foreground)" }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  tickFormatter={(value) => truncate(value, isNarrow ? 7 : 20)}
                  width={isNarrow ? 80 : 220}
                  style={{
                    fontSize: 12,
                    fill: "var(--color-muted-foreground)",
                  }}
                />

                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? value.toFixed(2) : value
                  }
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                    width: "12rem",
                    textWrap: "wrap",
                    fontSize: "0.75rem",
                  }}
                  labelStyle={{ color: "var(--color-popover-foreground)" }}
                  itemStyle={{
                    color: "var(--color-popover-foreground)",
                  }}
                />

                <Bar
                  dataKey="grade"
                  name="Nota"
                  shape={GradeBarShape}
                  label={{
                    position: "right",
                    fill: "var(--color-muted-foreground)",
                    fontSize: 11,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisTab;
