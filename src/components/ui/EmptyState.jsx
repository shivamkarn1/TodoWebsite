import { FaRegSadTear } from 'react-icons/fa';

const EmptyState = ({ message = "No items found", icon = <FaRegSadTear /> }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
      <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">
        {icon}
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;