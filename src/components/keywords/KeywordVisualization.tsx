import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function KeywordVisualization() {
  const [visualizationType, setVisualizationType] = useState<"pie" | "bar">("pie");

  // Sample data - this would be replaced with real data from your state management
  const data: CategoryData[] = [
    { name: "Landscapes", value: 45 },
    { name: "Still Life", value: 32 },
    { name: "Art & Design", value: 28 },
    { name: "Food & Drinks", value: 19 },
    { name: "Nature", value: 25 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Keyword Visualization</h1>
        <div className="space-x-2">
          <Button
            variant={visualizationType === "pie" ? "default" : "outline"}
            onClick={() => setVisualizationType("pie")}
            className="text-black"
          >
            Pie Chart
          </Button>
          <Button
            variant={visualizationType === "bar" ? "default" : "outline"}
            onClick={() => setVisualizationType("bar")}
            className="text-black"
          >
            Bar Chart
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Keywords by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {visualizationType === "pie" ? (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Top Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.map((category, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-black"
                >
                  <span>{category.name}</span>
                  <span className="font-bold">{category.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-black">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-black">
              <div>
                <p className="text-sm">Total Categories</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div>
                <p className="text-sm">Total Keywords</p>
                <p className="text-2xl font-bold">149</p>
              </div>
              <div>
                <p className="text-sm">Average Keywords per Category</p>
                <p className="text-2xl font-bold">29.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}