/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "lucide-react" {
  import * as React from "react";
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }
  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const X: LucideIcon;
  export const Menu: LucideIcon;
  export const Phone: LucideIcon;
  export const Mail: LucideIcon;
  export const MapPin: LucideIcon;
  export const Clock: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Award: LucideIcon;
  export const Tool: LucideIcon;
  export const Wrench: LucideIcon;
  export const Settings: LucideIcon;
  export const Cog: LucideIcon;
  export const Factory: LucideIcon;
  export const HardHat: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Search: LucideIcon;
  export const Plus: LucideIcon;
  export const Trash2: LucideIcon;
  export const Edit: LucideIcon;
  export const Edit2: LucideIcon;
  export const Edit3: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
  export const FileText: LucideIcon;
  export const Folder: LucideIcon;
  export const Layers: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Users: LucideIcon;
  export const LogOut: LucideIcon;
  export const LogIn: LucideIcon;
  export const Send: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Inbox: LucideIcon;
  export const Package: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Flame: LucideIcon;
  export const Zap: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Filter: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const Square: LucideIcon;
  export const Circle: LucideIcon;
  export const Lock: LucideIcon;
  export const User: LucideIcon;
  export const Bold: LucideIcon;
  export const Italic: LucideIcon;
  export const Underline: LucideIcon;
  export const List: LucideIcon;
  export const ListOrdered: LucideIcon;
  export const Heading1: LucideIcon;
  export const Heading2: LucideIcon;
  export const Heading3: LucideIcon;
  export const Quote: LucideIcon;
  export const Undo: LucideIcon;
  export const Redo: LucideIcon;
  export const Link: LucideIcon;
  export const Unlink: LucideIcon;
  export const Image: LucideIcon;
  export const Calendar: LucideIcon;
  export const Building2: LucideIcon;
  export const Navigation: LucideIcon;
  export const Compass: LucideIcon;
  export const Activity: LucideIcon;
  export const CheckCheck: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const Gauge: LucideIcon;
  export const Anchor: LucideIcon;
  export const Truck: LucideIcon;
  export const Cpu: LucideIcon;
  export const Globe: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Info: LucideIcon;
  export const Dot: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Settings2: LucideIcon;
  export const Droplet: LucideIcon;
  export const PackageSearch: LucideIcon;
  export const Newspaper: LucideIcon;
  export const Pencil: LucideIcon;
  export const Star: LucideIcon;
  export const ZoomIn: LucideIcon;
  export const Link2: LucideIcon;
}


