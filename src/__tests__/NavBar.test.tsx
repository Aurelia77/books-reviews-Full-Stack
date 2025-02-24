import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../components/NavBar";

describe("Navbar component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );
  });
  it("renders NavBar component without crashing", () => {
    const navBarElement = screen.getByRole("navigation");
    expect(navBarElement).toBeInTheDocument();
  });
  // Check if the NavBar component contains a links to the home page, search page and login page
  it("contains link redirecting to home page", () => {
    const homeLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/");
    expect(homeLink).toBeInTheDocument();
  });
  it("contains link redirecting to search page", () => {
    const searchLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/searchbooks");
    expect(searchLink).toBeInTheDocument();
  });
  it("contains link redirecting to login page", () => {
    const loginLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/login");
    expect(loginLink).toBeInTheDocument();
  });

  // Check if the links works
  it("should navigate to the home page when the home link is clicked", () => {
    const homeLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/");
    homeLink?.click();
    expect(window.location.pathname).toBe("/");
  });
  it("should navigate to the search page when the search link is clicked", () => {
    const searchLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/searchbooks");
    searchLink?.click();
    expect(window.location.pathname).toBe("/searchbooks");
  });
  //   it("should navigate to the mybooks page when the search link is clicked", () => {
  //     const mybooksLink = screen
  //       .getAllByRole("link")
  //       .find((link) => link.getAttribute("href") === "/mybooks");
  //     mybooksLink?.click();
  //     expect(window.location.pathname).toBe("/mybooks");
  //   });
  it("should navigate to the login page when the login link is clicked", () => {
    const loginLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/login");
    loginLink?.click();
    expect(window.location.pathname).toBe("/login");
  });
});
