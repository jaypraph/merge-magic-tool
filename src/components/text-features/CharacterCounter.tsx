interface CharacterCounterProps {
  currentLength: number;
  maxLength?: number;
}

export function CharacterCounter({ currentLength, maxLength = 140 }: CharacterCounterProps) {
  return (
    <span className="text-xs text-gray-500">
      {currentLength}/{maxLength}
    </span>
  );
}