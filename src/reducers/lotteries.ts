import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Lottery, LotteryContests } from "../types/Lottery";
import { Contest } from "../types/Contest";
import fetch from "cross-fetch";
import apis from "../constants/apis";

export interface LotteriesState {
  list: Lottery[];
  loading: boolean;
}

export const fetchLotteries = createAsyncThunk(
  "lotteries/fetchLotteries",
  async () => {
    const response = await fetch(`${apis.brainn_lottery}/loterias`);
    const data: Lottery[] = await response.json();
    return data;
  }
);

export const fetchContestsByLotteryId = createAsyncThunk(
  "lotteries/fetchContestsByLotteryId",
  async (lotteryId: number) => {
    const response = await fetch(`${apis.brainn_lottery}/loterias-concursos`);
    const data: LotteryContests[] = await response.json();
    const filteredData = data.filter((v) => {
      return v.loteriaId === lotteryId;
    });
    return filteredData;
  }
);

export const fetchContestDetails = createAsyncThunk(
  "lotteries/fetchContestDetails",
  async (contestsIds: string[]) => {
    const data: Contest[] = [];
    for (const id of contestsIds) {
      const response = await fetch(`${apis.brainn_lottery}/concursos/${id}`);
      data.push(await response.json());
    }
    return data;
  }
);

export const lotteriesSlice = createSlice({
  name: "lotteries",
  initialState: initialState().lotteries as LotteriesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLotteries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLotteries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchContestsByLotteryId.pending, (state, action) => {
        const lottery = state.list.find((l) => l.id === action.meta.arg);
        if (lottery) {
          lottery.loading = true;
        }
      })
      .addCase(fetchContestsByLotteryId.fulfilled, (state, action) => {
        const lottery = state.list.find((l) => l.id === action.meta.arg);
        if (lottery) {
          lottery.loading = false;
          lottery.contests = {
            list: action.payload.map((lc) => ({ id: lc.concursoId })),
            loading: false,
          };
        }
      });
  },
});

export default lotteriesSlice.reducer;
