import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Tag, FolderOpen, HelpCircle, Mail } from "lucide-react";

export function HelpPage() {
  const faqs = [
    {
      question: "How do I add a new category?",
      answer: "Click on the 'Categories' tab and use the 'Add New Category' button at the top of the page. Fill in the category name and click 'Save'.",
    },
    {
      question: "Can I export my keywords?",
      answer: "Yes! Go to the Import/Export section and click on the 'Export JSON' button to download all your keywords and categories.",
    },
    {
      question: "How do I organize my keywords?",
      answer: "Keywords can be organized into categories. You can add, edit, or delete keywords from the 'Keywords' section, and assign them to specific categories.",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-8 w-8 text-black" />
        <h1 className="text-3xl font-bold text-black">Help Center</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black">Use the search bar to quickly find keywords and categories.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black">Manage your keywords with easy-to-use tools for adding, editing, and organizing.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black">Group related keywords together in custom categories.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-black">{faq.question}</h3>
                <p className="text-black">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Need More Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black">
            If you can't find the answer you're looking for, please contact our support team at{" "}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}