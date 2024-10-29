interface ItemInfoRowProps {
  title: string;
  value: string;
  classnames?: string;
}
export const ItemInfoRow: React.FC<ItemInfoRowProps> = ({ title, value }) => (
  <div className="flex justify-between">
    <p className="text-sm text-body">{title}</p>
    <span className="text-sm font-semibold text-body">{value}</span>
  </div>
);
