import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";
import { AuthContext } from "../../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Login Component", () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    mockLogin.mockReset();
    mockRegister.mockReset();
    mockLogout.mockReset();
  });

  const renderComponent = () =>
    render(
      <AuthContext.Provider
        value={{
          token: null,
          login: mockLogin,
          register: mockRegister,
          logout: mockLogout,
        }}
      >
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

  it("renders login form", () => {
    renderComponent();

    const heading = screen.getByRole("heading", { name: /login/i, level: 2 });
    expect(heading).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email:");
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByLabelText("Password:");
    expect(passwordInput).toBeInTheDocument();

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("calls login function on form submit", () => {
    renderComponent();

    const emailInput = screen.getByLabelText("Email:") as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      "Password:"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("displays error message on login failure", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Login failed"));

    render(
      <AuthContext.Provider
        value={{
          token: null,
          login: mockLogin,
          register: mockRegister,
          logout: mockLogout,
        }}
      >
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    const emailInput = screen.getByLabelText("Email:") as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      "Password:"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "wrongpassword");

    const errorMsg = await screen.findByText("Login failed");
    expect(errorMsg).toBeInTheDocument();
  });
});
