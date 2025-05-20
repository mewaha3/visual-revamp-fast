
import React from "react";
import { 
  Brush, // Replace Broom with Brush
  Shield, 
  Bath, 
  Scissors, 
  Factory, 
  Package, 
  Search, 
  Dog, 
  Car, 
  Home, 
  Glasses, 
  FileText,
  CarFront,
  TreeDeciduous
} from "lucide-react";

export type IconName = 
  | "broom" 
  | "shield" 
  | "bath" 
  | "scissors" 
  | "factory" 
  | "package" 
  | "search" 
  | "dog" 
  | "car" 
  | "home" 
  | "glasses" 
  | "file-text"
  | "car-front"
  | "tree-deciduous";

export const getJobIcon = (iconName: IconName) => {
  switch (iconName) {
    case "broom":
      return <Brush className="mr-2 h-4 w-4" />; // Using Brush instead of Broom
    case "shield":
      return <Shield className="mr-2 h-4 w-4" />;
    case "bath":
      return <Bath className="mr-2 h-4 w-4" />;
    case "scissors":
      return <Scissors className="mr-2 h-4 w-4" />;
    case "factory":
      return <Factory className="mr-2 h-4 w-4" />;
    case "package":
      return <Package className="mr-2 h-4 w-4" />;
    case "search":
      return <Search className="mr-2 h-4 w-4" />;
    case "dog":
      return <Dog className="mr-2 h-4 w-4" />;
    case "car":
      return <Car className="mr-2 h-4 w-4" />;
    case "home":
      return <Home className="mr-2 h-4 w-4" />;
    case "glasses":
      return <Glasses className="mr-2 h-4 w-4" />;
    case "file-text":
      return <FileText className="mr-2 h-4 w-4" />;
    case "car-front":
      return <CarFront className="mr-2 h-4 w-4" />;
    case "tree-deciduous":
      return <TreeDeciduous className="mr-2 h-4 w-4" />;
    default:
      return <Home className="mr-2 h-4 w-4" />;
  }
};
