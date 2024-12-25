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
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit, Trash2, Link as LinkIcon } from "lucide-react";

interface Keyword {
  id: number;
  text: string;
  category: string;
  relatedLinks: string[];
  notes: string;
}

export function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([
    {
      id: 1,
      text: "mountain landscape",
      category: "Landscapes",
      relatedLinks: ["https://example.com/link1"],
      notes: "Popular in nature photography",
    },
    {
      id: 2,
      text: "vintage roses",
      category: "Flowers Tags",
      relatedLinks: ["https://example.com/link2"],
      notes: "Classic floral element",
    },
    {
      id: 3,
      text: "coffee beans",
      category: "Food Tags",
      relatedLinks: ["https://example.com/link3"],
      notes: "Good for cafe themes",
    },
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-black">Keywords</h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-black" />
            <Input placeholder="Search keywords..." className="pl-8 text-black placeholder:text-black/60" />
          </div>
          <Button className="text-black whitespace-nowrap">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Keyword
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black">Keyword</TableHead>
              <TableHead className="text-black">Category</TableHead>
              <TableHead className="text-black">Related Links</TableHead>
              <TableHead className="text-black">Notes</TableHead>
              <TableHead className="text-black text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword) => (
              <TableRow key={keyword.id}>
                <TableCell className="font-medium text-black">
                  {keyword.text}
                </TableCell>
                <TableCell className="text-black">{keyword.category}</TableCell>
                <TableCell className="text-black">
                  {keyword.relatedLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline mr-2"
                    >
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Link {index + 1}
                    </a>
                  ))}
                </TableCell>
                <TableCell className="text-black">{keyword.notes}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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