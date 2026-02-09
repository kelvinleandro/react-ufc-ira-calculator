import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PendingCourse } from "@/types/pdf";

interface PendingTabProps {
  pendingCourses: PendingCourse[];
}

const PendingTab = ({ pendingCourses }: PendingTabProps) => {
  return (
    <div className="animate-fade-in">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-left">
            Disciplinas Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Código</TableHead>
                <TableHead className="text-muted-foreground">
                  Componente Curricular
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Carga Horária
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingCourses.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-border transition-colors hover:bg-muted/50 text-left"
                >
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.creditHour}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingTab;
