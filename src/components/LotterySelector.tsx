import React from "react";
import { Lottery } from "../types/Lottery";

type Props = {
  lotteries: Lottery[];
};

const LotterySelector: React.FC<Props> = ({ lotteries }) => {
  return (
    <select>
      {lotteries.map((l: Lottery) => (
        <option value={l.id} key={`${l.id}-${l.nome}`}>
          {l.nome}
        </option>
      ))}
    </select>
  );
};

export default LotterySelector;
