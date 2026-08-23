import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Home from "@/app/page";

afterEach(cleanup);

describe("Home", () => {
  it("renders Frank Ncube as the primary heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Frank Ncube/i }),
    ).toBeInTheDocument();
  });

  it("renders the hero portrait with meaningful alt text", () => {
    render(<Home />);

    expect(
      screen.getByRole("img", { name: "Portrait of Frank Ncube" }),
    ).toBeInTheDocument();
  });
});
