import { createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Lottery } from "../types/Lottery";

export interface LotteriesState {
  list: Lottery[];
}

export const lotteriesSlice = createSlice({
  name: "lotteries",
  initialState: initialState().lotteries,
  reducers: {},
  extraReducers: (builder) => {},
});

export default lotteriesSlice.reducer;
