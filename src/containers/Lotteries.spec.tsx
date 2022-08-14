import React from "react";
import { MockStoreEnhanced } from "redux-mock-store";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import ConnectedLotteries from "../containers/Lotteries";
import {
  fetchContestsByLotteryId,
  fetchLotteries,
} from "../reducers/lotteries";
import LotterySelector from "../components/LotterySelector";
import { fireEvent, render, screen } from "@testing-library/react";

describe("<Lotteries />", () => {
  let store: MockStoreEnhanced<unknown, {}>;

  const lotteryA = {
    id: 0,
    nome: "LoteriaA",
    loading: false,
    error: false,
  };

  function setup(storeProps?: object): JSX.Element {
    const middlewares = [thunk];
    store = configureMockStore(middlewares)({
      lotteries: { list: [], loading: false, error: false, ...storeProps },
    });
    return (
      <Provider store={store}>
        <ConnectedLotteries />
      </Provider>
    );
  }

  afterEach(() => {
    store.clearActions();
  });

  it("should fetch lotteries list", () => {
    mount(setup());

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: fetchLotteries.pending.type,
        }),
      ])
    );
  });

  it("should contain <LotterySelector />", () => {
    const wrapper = mount(setup());

    expect(wrapper.find(LotterySelector).length).toBe(1);
  });

  it("should fetch contests when lottery is selected", () => {
    render(setup({ list: [lotteryA] }));
    const select = screen.getByTestId("lottery-selector") as HTMLSelectElement;

    fireEvent.change(select, { target: { value: "0" } });

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          meta: expect.objectContaining({ arg: lotteryA.id }),
          type: fetchContestsByLotteryId.pending.type,
        }),
      ])
    );
  });
});
