import mockFetch from "cross-fetch";
import reducer, {
  fetchContestsByLotteryId,
  fetchLotteries,
  fetchContestDetails,
} from "./lotteries";
import initialState from "./initialState";

jest.mock("cross-fetch");

const mockedFetch: jest.Mock<unknown> = mockFetch as any;

const lotteryA = {
  id: 0,
  nome: "LoteriaA",
  loading: false,
  error: false,
};
const lotteryContestA = {
  loteriaId: 0,
  concursoId: "0001",
};
const contestA = {
  id: "0001",
  loteria: 0,
  loading: false,
  error: false,
  numeros: ["31", "32", "39", "42", "43", "51"],
  data: "2022-07-27T13:46:02.349Z",
};
const contestB = {
  id: "0002",
  loteria: 0,
  loading: false,
  error: false,
  numeros: ["31", "32", "39", "42", "43", "51"],
  data: "2022-07-27T13:46:02.349Z",
};
const completeLotteryA = {
  ...lotteryA,
  contests: {
    list: [
      { id: contestA.id, loading: false, error: false },
      { id: contestB.id, loading: false, error: false },
    ],
    loading: false,
  },
};

describe("Reducers::Lotteries", () => {
  const getInitialState = () => {
    return initialState().lotteries;
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should handle fetchLotteries.pending", () => {
    const appState = {
      list: [],
      loading: false,
      error: false,
    };
    const action = { type: fetchLotteries.pending };
    const expected = {
      list: [],
      loading: true,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchLotteries.fulfilled", () => {
    const appState = {
      list: [],
      loading: true,
      error: false,
    };
    const action = { type: fetchLotteries.fulfilled, payload: [lotteryA] };
    const expected = {
      list: [lotteryA],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchLotteries.rejected", () => {
    const appState = {
      list: [],
      loading: false,
      error: false,
    };
    const action = { type: fetchLotteries.rejected };
    const expected = {
      list: [],
      loading: false,
      error: true,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestsByLotteryId.pending", () => {
    const appState = {
      list: [lotteryA],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestsByLotteryId.pending,
      meta: { arg: lotteryA.id },
    };
    const expected = {
      list: [
        {
          ...lotteryA,
          loading: true,
        },
      ],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestsByLotteryId.pending when lottery not found", () => {
    const appState = {
      list: [],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestsByLotteryId.pending,
      meta: { arg: lotteryA.id },
    };
    const expected = {
      list: [],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestsByLotteryId.fulfilled", () => {
    const appState = {
      list: [{ ...lotteryA, loading: true }],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestsByLotteryId.fulfilled,
      meta: { arg: lotteryA.id },
      payload: [lotteryContestA],
    };
    const expected = {
      list: [
        {
          ...lotteryA,
          loading: false,
          contests: {
            list: [{ id: lotteryContestA.concursoId }],
            loading: false,
          },
        },
      ],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestsByLotteryId.fulfilled when lottery not found", () => {
    const appState = {
      list: [],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestsByLotteryId.fulfilled,
      meta: { arg: lotteryA.id },
      payload: [lotteryContestA],
    };
    const expected = {
      list: [],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestsByLotteryId.rejected", () => {
    const appState = {
      list: [lotteryA],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestsByLotteryId.rejected,
      meta: { arg: lotteryA.id },
    };
    const expected = {
      list: [
        {
          ...lotteryA,
          error: true,
        },
      ],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestsByLotteryId.rejected when lottery not found", () => {
    const appState = {
      list: [],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestsByLotteryId.rejected,
      meta: { arg: lotteryA.id },
    };
    const expected = {
      list: [],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestDetails.pending", () => {
    const appState = {
      list: [completeLotteryA],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestDetails.pending,
      meta: { arg: completeLotteryA },
    };
    const expected = {
      list: [
        {
          ...lotteryA,
          contests: {
            list: [
              { ...completeLotteryA.contests.list[0], loading: true },
              { ...completeLotteryA.contests.list[1], loading: true },
            ],
            loading: false,
          },
        },
      ],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestDetails.pending when lottery not found", () => {
    const appState = {
      list: [],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestDetails.pending,
      meta: { arg: completeLotteryA },
    };
    const expected = {
      list: [],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestDetails.fulfilled", () => {
    const appState = {
      list: [completeLotteryA],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestDetails.fulfilled,
      meta: { arg: completeLotteryA },
      payload: [contestA, contestB],
    };
    const expected = {
      list: [
        {
          ...lotteryA,
          contests: {
            list: [contestA, contestB],
            loading: false,
          },
        },
      ],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestDetails.fulfilled when lottery not found", () => {
    const appState = {
      list: [],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestDetails.fulfilled,
      meta: { arg: completeLotteryA },
      payload: [contestA, contestB],
    };
    const expected = {
      list: [],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestDetails.fulfilled when contest not found", () => {
    const appState = {
      list: [completeLotteryA],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestDetails.fulfilled,
      meta: { arg: completeLotteryA },
      payload: [],
    };
    const expected = {
      list: [
        {
          ...lotteryA,
          contests: {
            list: completeLotteryA.contests.list,
            loading: false,
          },
        },
      ],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestDetails.rejected", () => {
    const appState = {
      list: [completeLotteryA],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestDetails.rejected,
      meta: { arg: completeLotteryA },
    };
    const expected = {
      list: [
        {
          ...lotteryA,
          contests: {
            list: [
              { id: contestA.id, loading: false, error: true },
              { id: contestB.id, loading: false, error: true },
            ],
            loading: false,
          },
        },
      ],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestDetails.rejected when lottery not found", () => {
    const appState = {
      list: [],
      loading: false,
      error: false,
    };
    const action = {
      type: fetchContestDetails.rejected,
      meta: { arg: completeLotteryA },
    };
    const expected = {
      list: [],
      loading: false,
      error: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });
});

describe("Actions::Lotteries", () => {
  const dispatch = jest.fn();

  const lotteryContestB = {
    loteriaId: 1,
    concursoId: "0002",
  };

  afterAll(() => {
    dispatch.mockClear();
    mockedFetch.mockClear();
  });

  it("should fetch lotteries", async () => {
    mockedFetch.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve([lotteryA]);
        },
      })
    );
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchLotteries.pending.type,
        meta: expect.objectContaining({ arg: undefined }),
      }),
      expect.objectContaining({
        type: fetchLotteries.fulfilled.type,
        meta: expect.objectContaining({ arg: undefined }),
        payload: [lotteryA],
      }),
    ]);

    await fetchLotteries()(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch lotteries", async () => {
    mockedFetch.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchLotteries.pending.type,
        meta: expect.objectContaining({ arg: undefined }),
      }),
      expect.objectContaining({
        type: fetchLotteries.rejected.type,
        meta: expect.objectContaining({ arg: undefined }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    await fetchLotteries()(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fetch a lottery's contests", async () => {
    mockedFetch.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve([lotteryContestA, lotteryContestB]);
        },
      })
    );
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContestsByLotteryId.pending.type,
        meta: expect.objectContaining({ arg: lotteryA.id }),
      }),
      expect.objectContaining({
        type: fetchContestsByLotteryId.fulfilled.type,
        meta: expect.objectContaining({ arg: lotteryA.id }),
        payload: [lotteryContestA],
      }),
    ]);

    await fetchContestsByLotteryId(lotteryA.id)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch lottery's contests", async () => {
    mockedFetch.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContestsByLotteryId.pending.type,
        meta: expect.objectContaining({ arg: lotteryA.id }),
      }),
      expect.objectContaining({
        type: fetchContestsByLotteryId.rejected.type,
        meta: expect.objectContaining({ arg: lotteryA.id }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    await fetchContestsByLotteryId(lotteryA.id)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fetch contests details", async () => {
    mockedFetch
      .mockReturnValueOnce(
        Promise.resolve({
          status: 200,
          json() {
            return Promise.resolve(contestA);
          },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          status: 200,
          json() {
            return Promise.resolve(contestB);
          },
        })
      );
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContestDetails.pending.type,
        meta: expect.objectContaining({
          arg: completeLotteryA,
        }),
      }),
      expect.objectContaining({
        type: fetchContestDetails.fulfilled.type,
        meta: expect.objectContaining({
          arg: completeLotteryA,
        }),
        payload: [contestA, contestB],
      }),
    ]);

    await fetchContestDetails(completeLotteryA)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch contests details", async () => {
    mockedFetch.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContestDetails.pending.type,
        meta: expect.objectContaining({ arg: completeLotteryA }),
      }),
      expect.objectContaining({
        type: fetchContestDetails.rejected.type,
        meta: expect.objectContaining({ arg: completeLotteryA }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    await fetchContestDetails(completeLotteryA)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should return empty array when no contests", async () => {
    const lottery = {
      ...completeLotteryA,
      contests: { list: [], loading: false },
    };
    let expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContestDetails.pending.type,
        meta: expect.objectContaining({
          arg: lottery,
        }),
      }),
      expect.objectContaining({
        type: fetchContestDetails.fulfilled.type,
        meta: expect.objectContaining({
          arg: lottery,
        }),
        payload: [],
      }),
    ]);

    await fetchContestDetails(lottery)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
