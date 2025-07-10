export interface App {
  id: number;
  name: string;
  icon: string;
  iconType?: "emoji" | "svg";
  color: string;
}

export interface AppSwitcherProps {
  apps?: App[];
  onAppClick?: (app: App) => void;
}

// Table-related types
export type CellRenderFunction = (
  value: unknown,
  row: Record<string, unknown>
) => React.ReactNode;

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: CellRenderFunction;
}

export interface TransactionHistoryRow {
  id: number;
  sourceIp: string;
  destinationIp: string;
  action: "ACCEPT" | "REJECT";
  startTime: string;
  endTime: string;
  packets: number;
  bytes: number;
  details: string;
}

export interface TableData {
  columns: TableColumn[];
  data: TransactionHistoryRow[];
}

// Transaction Chain types
export interface TransactionCardField {
  label: string;
  value: string;
  component: "text" | "badge" | "chart" | "row";
  props?: {
    className?: string;
    score?: number;
    size?: number;
  };
  subFields?: TransactionCardField[];
}

export interface TransactionCard {
  id: string;
  title: string;
  icon: string;
  bgColor: string;
  gradientClass?: string;
  fields: TransactionCardField[];
  linkedTo?: string;
}

export interface TransactionChainData {
  cards: TransactionCard[];
}

// Component Props
export interface DataTableProps {
  columns: TableColumn[];
  data: Record<string, unknown>[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  title?: string;
  maxHeight?: string;
  searchPlaceholder?: string;
}

export interface TransactionCardProps {
  card: TransactionCard;
  className?: string;
}

export interface TransactionChainProps {
  cards: TransactionCard[];
  showArrows?: boolean;
}
