import React, { FC } from "react";
import PointNumpad from "./PointNumpad";

export interface IEnterPointProps {
  playerName: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

const EnterPoint: FC<IEnterPointProps> = ({ playerName, value, onChange }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div>
      <button
        className="bg-gray-100 border border-gray-300 text-gray-900 rounded text-sm p-3 px-1 block w-10  "
        onClick={() => {
          setOpen(true);
        }}
      >
        {value ?? "📝"}
      </button>
      <PointNumpad
        playerName={playerName}
        value={value}
        onChange={(value) => {
          onChange(value);
          setOpen(false);
        }}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default EnterPoint;
