import classNames from 'classnames';

interface ScheduleProps {
  schedule: any;
  checked: boolean;
}
const ScheduleCard: React.FC<ScheduleProps> = ({ checked, schedule }) => (
  <div
    className={classNames(
      'group relative h-full cursor-pointer rounded border p-4 hover:border-accent',
      {
        'border-accent shadow-sm': checked,
        'border-transparent bg-gray-100': !checked,
      }
    )}
  >
    <span className="mb-2 block text-sm font-semibold text-heading">
      {schedule.title}
    </span>
    <span className="block text-sm text-heading">{schedule.description}</span>
  </div>
);

export default ScheduleCard;
