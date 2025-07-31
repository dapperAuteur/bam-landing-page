export interface IInfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  colorClass: string | '';
}

export interface IStatCardProps {
  value: string;
  label: string;
  children?: React.ReactNode;
  color: string | '';
}