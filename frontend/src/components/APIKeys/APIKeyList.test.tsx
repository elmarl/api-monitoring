import { render, screen, waitFor } from "@testing-library/react";
import APIKeyList from "./APIKeyList";
import { AuthContext } from "../../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import * as api from "../../api";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockedFunction,
} from "vitest";
import { AxiosResponse, AxiosRequestHeaders } from "axios";

vi.mock("../../api");

describe("APIKeyList Component", () => {
  const mockFetchAPIKeys = api.fetchAPIKeys as MockedFunction<
    typeof api.fetchAPIKeys
  >;

  const mockResponse: AxiosResponse = {
    data: [
      { id: "1", key: "api-key-1", createdAt: "2024-04-27T12:34:56.789Z" },
      { id: "2", key: "api-key-2", createdAt: "2024-04-27T13:00:00.000Z" },
    ],
    status: 200,
    statusText: "OK",
    headers: {} as AxiosRequestHeaders,
    config: {
      headers: {} as AxiosRequestHeaders,
    },
    request: {},
  };

  const renderComponent = () =>
    render(
      <AuthContext.Provider
        value={{
          token: "mock-token",
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <BrowserRouter>
          <APIKeyList />
        </BrowserRouter>
      </AuthContext.Provider>
    );

  beforeEach(() => {
    mockFetchAPIKeys.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders API keys after fetching", async () => {
    renderComponent();

    expect(screen.getByText("Your API Keys")).toBeInTheDocument();
    expect(screen.getByText("Generate New API Key")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("api-key-1")).toBeInTheDocument();
      expect(screen.getByText("api-key-2")).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    mockFetchAPIKeys.mockRejectedValue(new Error("Failed to fetch"));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch API keys")).toBeInTheDocument();
    });
  });
});
