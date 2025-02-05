import React from 'react';
import { FileText } from 'lucide-react';

const AssignmentCard = ({ assignment, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(assignment)}
      className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4 
                 hover:bg-gray-600 cursor-pointer transition-all"
    >
      <FileText size={24} className="text-blue-400" />
      <div>
        <h3 className="font-semibold text-white">{assignment.title}</h3>
        <p className="text-gray-400 text-sm">{assignment.date}</p>
      </div>
    </div>
  );
};

export default AssignmentCard;