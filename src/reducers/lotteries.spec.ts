import mockFetch from "cross-fetch";
import reducer, { fetchContests, fetchLotteries } from "./lotteries";
import initialState from "./initialState";

jest.mock("cross-fetch");

const mockedFetch: jest.Mock<unknown> = mockFetch as any;

describe("Reducers::Lotteries", () => {
  const getInitialState = () => {
    return initialState().lotteries;
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });
});

describe("Actions::Lotteries", () => {
  const dispatch = jest.fn();

  const lotteryA = {
    id: 0,
    nome: "LoteriaA",
  };
  const contestA = {
    loteriaId: 0,
    concursoId: "0001",
  };
  const contestB = {
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
          return Promise.resolve([contestA, contestB]);
        },
      })
    );
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContests.pending.type,
        meta: expect.objectContaining({ arg: lotteryA.id }),
      }),
      expect.objectContaining({
        type: fetchContests.fulfilled.type,
        meta: expect.objectContaining({ arg: lotteryA.id }),
        payload: [contestA],
      }),
    ]);

    await fetchContests(lotteryA.id)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch lotteries contests", async () => {
    mockedFetch.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchContests.pending.type,
        meta: expect.objectContaining({ arg: lotteryA.id }),
      }),
      expect.objectContaining({
        type: fetchContests.rejected.type,
        meta: expect.objectContaining({ arg: lotteryA.id }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    await fetchContests(lotteryA.id)(dispatch, () => {}, {});

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
