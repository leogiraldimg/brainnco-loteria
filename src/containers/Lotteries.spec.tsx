import React from "react";
import { MockStoreEnhanced } from "redux-mock-store";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import ConnectedLotteries from "../containers/Lotteries";
import { fetchLotteries } from "../reducers/lotteries";
import LotterySelector from "../components/LotterySelector";

describe("<Lotteries />", () => {
  let store: MockStoreEnhanced<unknown, {}>;

  function setup(): JSX.Element {
    const middlewares = [thunk];
    store = configureMockStore(middlewares)({
      lotteries: { list: [], loading: false, error: false },
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
});
