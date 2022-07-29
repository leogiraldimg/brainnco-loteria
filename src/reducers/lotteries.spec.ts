import mockFetch from "cross-fetch";
import reducer, {
  fetchContestsByLotteryId,
  fetchLotteries,
  fetchContestDetails,
} from "./lotteries";
import initialState from "./initialState";
import { Lottery } from "../types/Lottery";

jest.mock("cross-fetch");

const mockedFetch: jest.Mock<unknown> = mockFetch as any;

const lotteryA = {
  id: 0,
  nome: "LoteriaA",
  loading: false,
};
const lotteryContestA = {
  loteriaId: 0,
  concursoId: "0001",
};
const contestA = {
  id: "0001",
  loteria: 0,
  numeros: ["31", "32", "39", "42", "43", "51"],
  data: "2022-07-27T13:46:02.349Z",
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
    };
    const action = { type: fetchLotteries.pending };
    const expected = {
      list: [],
      loading: true,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchLotteries.fulfilled", () => {
    const appState = {
      list: [],
      loading: true,
    };
    const action = { type: fetchLotteries.fulfilled, payload: [lotteryA] };
    const expected = {
      list: [lotteryA],
      loading: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestsByLotteryId.pending", () => {
    const appState = {
      list: [lotteryA],
      loading: false,
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
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchContestsByLotteryId.fulfilled", () => {
    const appState = {
      list: [{ ...lotteryA, loading: true }],
      loading: false,
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

  it("should fetch contest details", async () => {
    mockedFetch.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve(contestA);
        },
      })
    );
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContestDetails.pending.type,
        meta: expect.objectContaining({ arg: contestA.id }),
      }),
      expect.objectContaining({
        type: fetchContestDetails.fulfilled.type,
        meta: expect.objectContaining({ arg: contestA.id }),
        payload: contestA,
      }),
    ]);

    await fetchContestDetails(contestA.id)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch contest details", async () => {
    mockedFetch.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContestDetails.pending.type,
        meta: expect.objectContaining({ arg: contestA.id }),
      }),
      expect.objectContaining({
        type: fetchContestDetails.rejected.type,
        meta: expect.objectContaining({ arg: contestA.id }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    await fetchContestDetails(contestA.id)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
