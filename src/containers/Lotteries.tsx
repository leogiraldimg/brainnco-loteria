import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import LotterySelector from "../components/LotterySelector";
import { fetchLotteries, selectLotteries } from "../reducers/lotteries";
import { useAppSelector } from "../store/configureStore";

export const Lotteries: React.FC = () => {
  const dispatch = useDispatch();
  const lotteries = useAppSelector(selectLotteries);

  useEffect(() => {
    dispatch(fetchLotteries());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LotterySelector lotteries={lotteries} />;
};

export default Lotteries;
