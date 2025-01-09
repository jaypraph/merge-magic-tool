import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function DescriptionEditor() {
  const [textAreas, setTextAreas] = useState(["", "", "", ""]);
  const [output, setOutput] = useState("");
  const editableParts = ["Blue Fantasy Island", "Oil Painting", "Medieval City", "Japanese Art"];
  const sentenceTemplate = `JPG file for | Tv Frame Art | Blue Fantasy Island, Oil Painting, Medieval City, Japanese Art. Designed specifically for the Samsung TV Frame with dimensions of 3840x2160 pixels; not intended for printing purposes.`;

  const handleTextAreaChange = (index: number, value: string) => {
    const newTextAreas = [...textAreas];
    newTextAreas[index] = value;
    setTextAreas(newTextAreas);
  };

  const handleDone = () => {
    let updatedSentence = sentenceTemplate;

    editableParts.forEach((part, index) => {
      const userInput = textAreas[index].trim();
      if (userInput !== "") {
        updatedSentence = updatedSentence.replace(part, userInput);
      } else {
        updatedSentence = updatedSentence.replace(part, "");
      }
    });

    updatedSentence = updatedSentence
      .replace(/\s*,\s*,/g, ",")
      .replace(/\s+/g, " ")
      .trim();

    setOutput(updatedSentence);
  };

  const handleClear = () => {
    setTextAreas(["", "", "", ""]);
    setOutput("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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

      <div className="mt-6 text-sm space-y-4">
        <p>
          "JPG file for | Tv Frame Art | Blue Fantasy Island, Oil Painting, Medieval City, Japanese Art. Designed specifically for the Samsung TV Frame with dimensions of 3840x2160 pixels; not intended for printing purposes."
        </p>
        <p>
          "Download this painting specifically designed for TV Frame. This digital file, optimized for screen display, comes in a high-resolution JPG format with dimensions of 3840x2160 pixels, suitable for any 16:9 ratio displays. Please note that this file is intended for digital use only and is not suitable for physical printing. Keep in mind that colors may vary based on your screen display settings."
        </p>
        <p>
          "Upon purchase, you'll receive an instant download link. No physical items will be shipped. To receive assistance in adding this file to your TV, please visit: https://www.samsung.com/us/support/answer/ANS00076727/"
        </p>
      </div>
    </div>
  );
}