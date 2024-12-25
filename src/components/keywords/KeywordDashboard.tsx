import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KeywordDashboard() {
  const categories = [
    { name: "Landscapes", count: 45 },
    { name: "Still Life", count: 32 },
    { name: "Art & Design", count: 28 },
    { name: "Food & Drinks", count: 19 },
  ];

  const recentActivity = [
    { action: "Added keyword", item: "mountain landscape", time: "2 mins ago" },
    { action: "Viewed category", item: "Still Life", time: "5 mins ago" },
    { action: "Edited keyword", item: "abstract art", time: "10 mins ago" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-black">Keyword Dashboard</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-black" />
          <Input placeholder="Search keywords..." className="pl-8 text-black placeholder:text-black/60" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-black">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-black">{category.count}</p>
              <p className="text-sm text-black">Keywords</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-black">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button className="text-black">Add Category</Button>
            <Button variant="outline" className="text-black">Add Keyword</Button>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-black">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-black">{activity.action}</p>
                    <p className="text-sm text-black">{activity.item}</p>
                  </div>
                  <span className="text-sm text-black">{activity.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}