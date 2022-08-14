import React from "react";
import { Lottery } from "../types/Lottery";

type Props = {
  lotteries: Lottery[];
  toggleLotterySelected: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const LotterySelector: React.FC<Props> = ({
  lotteries,
  toggleLotterySelected,
}) => {
  return (
    <select data-testid="lottery-selector" onChange={toggleLotterySelected}>
      {lotteries.map((l: Lottery) => (
        <option value={l.id} key={`${l.id}-${l.nome}`}>
          {l.nome}
        </option>
      ))}
    </select>
  );
};

export default LotterySelector;
