import React from "react";
import LotterySelector from "./LotterySelector";
import { mount } from "enzyme";

describe("<LotterySelector />", () => {
  const lotteryA = {
    id: 0,
    nome: "LoteriaA",
    loading: false,
    error: false,
  };
  const lotteryB = {
    id: 1,
    nome: "LoteriaB",
    loading: false,
    error: false,
  };
  const toggleLotterySelectedMock = jest.fn();

  it("should render the lotteries options", () => {
    const wrapper = mount(
      <LotterySelector
        lotteries={[lotteryA, lotteryB]}
        toggleLotterySelected={toggleLotterySelectedMock}
      />
    );

    expect(wrapper.find("option").length).toBe(2);
  });
});
