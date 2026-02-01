import { TrendingUp, Gauge, PieChart, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Discipline, PendingCourse } from "@/types/pdf";
import type { IraData } from "@/types/ira";
import MetricCard from "../MetricCard";
import PendingTab from "./PendingTab";
import AnalysisTab from "./AnalysisTab";

interface DashboardProps {
  studentName: string;
  iraData: IraData;
  pendingCourses: PendingCourse[];
  disciplines: Discipline[];
}

const Dashboard = ({
  studentName,
  iraData,
  pendingCourses,
  disciplines,
}: DashboardProps) => {
  return (
    <div className="md:min-h-[calc(100vh-4rem)] p-8 border w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Resultados para: <span className="text-primary">{studentName}</span>
          </h1>
        </div>
        {/* <SimulationModal /> */}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:max-w-[85%] md:mx-auto">
        <MetricCard
          title="IRA Individual"
          value={iraData.individualIra.toFixed(3)}
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title="IRA Geral"
          value={iraData.generalIra.toFixed(3)}
          icon={Gauge}
          color="green"
        />
        <MetricCard
          title="Progresso"
          value={`${iraData.courseProgress.toFixed(1)} %`}
          icon={PieChart}
          color="purple"
        />
        <MetricCard
          title="Taxa de Aprovação"
          value={`${iraData.passRate.toFixed(1)} %`}
          icon={GraduationCap}
          color="amber"
        />
      </div>

      <Tabs defaultValue="analise" className="w-full">
        <TabsList className="mb-6 bg-muted">
          <TabsTrigger
            value="analise"
            className="dark:data-[state=active]:bg-background"
          >
            Análise
          </TabsTrigger>
          <TabsTrigger
            value="pendencias"
            className="dark:data-[state=active]:bg-background"
          >
            Pendências
          </TabsTrigger>
        </TabsList>
        <TabsContent value="analise">
          <AnalysisTab iraData={iraData} disciplines={disciplines} />
        </TabsContent>
        <TabsContent value="pendencias">
          <PendingTab pendingCourses={pendingCourses} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
