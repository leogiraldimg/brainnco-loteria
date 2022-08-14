import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import LotterySelector from "../components/LotterySelector";
import {
  fetchContestsByLotteryId,
  fetchLotteries,
  selectLotteries,
} from "../reducers/lotteries";
import { useAppSelector } from "../store/configureStore";

export const Lotteries: React.FC = () => {
  const dispatch = useDispatch();
  const lotteries = useAppSelector(selectLotteries);

  useEffect(() => {
    dispatch(fetchLotteries());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleLotterySelected(event: React.ChangeEvent<HTMLSelectElement>) {
    const lotteryId = event.target.value;

    dispatch(fetchContestsByLotteryId(parseInt(lotteryId)));
  }

  return (
    <LotterySelector
      lotteries={lotteries}
      toggleLotterySelected={toggleLotterySelected}
    />
  );
};

export default Lotteries;
