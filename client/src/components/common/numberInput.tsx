import React from 'react';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import RemoveIcon from '@mui/icons-material/Remove'; // Add the RemoveIcon import



type NumberInputProps = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  setValue,
}) => {
  return (
    <div className="relative flex items-center overflow-hidden">
      <button
        className="h-full rounded-l-md border p-2 transition-all hover:bg-gray-50 active:bg-gray-50"
        onClick={() =>
          setValue((prev) => {
            if (prev > 0) {
              return prev - 1;
            }
            return 0;
          })
        }
      >
        <RemoveIcon className="text-primary h-4 w-4" />
      </button>
      <input
        className="focus:outline-primary focus:border-primary h-full w-8 border-l-0 border-r-0 p-2 text-center font-semibold"
        value={value}
        onChange={(event) => {
          const parseNumber = Number(event.target.value);

          if (!isNaN(parseNumber)) {
            setValue(parseNumber);
          }
        }}
      />
      <button
        className="h-full rounded-r-md border p-2 transition-all hover:bg-gray-50 active:bg-gray-50"
        onClick={() =>
          setValue((prev) => {
            return prev + 1;
          })
        }
      >
        <AddBoxOutlinedIcon className="text-primary h-4 w-4" />
      </button>
    </div>
  );
};