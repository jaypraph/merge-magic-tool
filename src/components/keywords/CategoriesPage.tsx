import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Eye, Edit, Trash2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  keywordCount: number;
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Flowers Tags", keywordCount: 124 },
    { id: 2, name: "Food Tags", keywordCount: 150 },
    { id: 3, name: "Christmas Tags", keywordCount: 90 },
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Categories</h1>
        <Button className="text-black">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black">Category Name</TableHead>
              <TableHead className="text-black text-right">Keywords</TableHead>
              <TableHead className="text-black text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-black">
                  {category.name}
                </TableCell>
                <TableCell className="text-right text-black">
                  {category.keywordCount}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="text-black">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-black">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-black">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}