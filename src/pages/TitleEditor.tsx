import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TitleEditor() {
  const [textAreas, setTextAreas] = useState(["", "", "", ""]);
  const [output, setOutput] = useState("");
  const [charCount, setCharCount] = useState(0);
  const remainingParts = ", Tv Frame Art, Television Picture Frame, Canvas, Samsung Frame Tv";

  const handleTextAreaChange = (index: number, value: string) => {
    const newTextAreas = [...textAreas];
    newTextAreas[index] = value;
    setTextAreas(newTextAreas);
    updateCharacterCount(newTextAreas);
  };

  const updateCharacterCount = (areas: string[]) => {
    const newParts = areas.filter(area => area.trim() !== "");
    const newSentence = `${newParts.join(', ')}${newParts.length > 0 ? ',' : ''}${remainingParts}`;
    setCharCount(newSentence.length);
  };

  const handleDone = () => {
    const newParts = textAreas.filter(area => area.trim() !== "");
    const newSentence = `${newParts.join(', ')}${newParts.length > 0 ? ',' : ''}${remainingParts}`;
    
    if (newSentence.length > 140) {
      setOutput("Error: The sentence exceeds 140 characters!");
    } else {
      setOutput(newSentence);
    }
  };

  const handleClear = () => {
    setTextAreas(["", "", "", ""]);
    setOutput("");
    setCharCount(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 text-lg">
        "Blue Fantasy Island, Oil Painting, Medieval City, Japanese Art, Tv Frame Art, Television Picture Frame, Canvas, Samsung Frame Tv"
      </div>
      
      <div className="space-y-4">
        {textAreas.map((text, index) => (
          <Textarea
            key={index}
            value={text}
            onChange={(e) => handleTextAreaChange(index, e.target.value)}
            placeholder=""
            className="w-full"
          />
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={handleDone}>Done</Button>
        <Button variant="destructive" onClick={handleClear}>Clear All</Button>
      </div>

      {output && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          {output}
        </div>
      )}

      <div className="mt-4 font-bold">
        {charCount}/140
      </div>
    </div>
  );
}