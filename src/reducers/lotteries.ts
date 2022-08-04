import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Lottery, LotteryContests } from "../types/Lottery";
import { Contest } from "../types/Contest";
import fetch from "cross-fetch";
import apis from "../constants/apis";

export interface LotteriesState {
  list: Lottery[];
  loading: boolean;
  error: boolean;
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
  async (lottery: Lottery) => {
    const data: Contest[] = [];
    if (lottery.contests?.list && lottery.contests?.list.length > 0) {
      const contestsIds = lottery.contests.list.map((c) => c.id);
      for (const id of contestsIds) {
        const response = await fetch(`${apis.brainn_lottery}/concursos/${id}`);
        data.push(await response.json());
      }
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
      .addCase(fetchLotteries.rejected, (state) => {
        state.loading = false;
        state.error = true;
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
      })
      .addCase(fetchContestsByLotteryId.rejected, (state, action) => {
        const lottery = state.list.find((l) => l.id === action.meta.arg);
        if (lottery) {
          lottery.loading = false;
          lottery.error = true;
        }
      })
      .addCase(fetchContestDetails.pending, (state, action) => {
        const lottery = state.list.find((l) => l.id === action.meta.arg.id);
        if (lottery && lottery.contests && lottery.contests.list.length > 0) {
          lottery.contests.list.forEach((c) => {
            c.loading = true;
          });
        }
      })
      .addCase(fetchContestDetails.fulfilled, (state, action) => {
        const lottery = state.list.find((l) => l.id === action.meta.arg.id);
        if (lottery && lottery.contests && lottery.contests.list.length > 0) {
          lottery.contests.list.forEach((c) => {
            const contest = action.payload.find((ct) => c.id === ct.id);
            if (contest) {
              c.data = contest.data;
              c.loading = false;
              c.loteria = contest.loteria;
              c.numeros = contest.numeros;
            }
          });
        }
      })
      .addCase(fetchContestDetails.rejected, (state, action) => {
        const lottery = state.list.find((l) => l.id === action.meta.arg.id);
        if (lottery && lottery.contests && lottery.contests.list.length > 0) {
          lottery.contests.list.forEach((c) => {
            c.loading = false;
            c.error = true;
          });
        }
      });
  },
});

export default lotteriesSlice.reducer;
