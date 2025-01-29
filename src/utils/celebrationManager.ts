import { 
  triggerClassicFireworks, 
  triggerColorfulStars, 
  triggerModernFireworks 
} from "./celebrationEffects";

export const triggerAllCelebrations = () => {
  triggerColorfulStars();
  triggerModernFireworks();
  triggerClassicFireworks();
};