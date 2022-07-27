import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Lottery } from "../types/Lottery";
import fetch from "cross-fetch";
import apis from "../constants/apis";

export interface LotteriesState {
  list: Lottery[];
}

export const fetchLotteries = createAsyncThunk(
  "lotteries/fetchLotteries",
  async () => {
    const response = await fetch(`${apis.brainn_lottery}/loterias`);
    const data: { data: Lottery[] } = await response.json();
    return data;
  }
);

export const lotteriesSlice = createSlice({
  name: "lotteries",
  initialState: initialState().lotteries,
  reducers: {},
  extraReducers: (builder) => {},
});

export default lotteriesSlice.reducer;
