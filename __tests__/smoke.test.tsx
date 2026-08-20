import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Home", () => {
  it("renders Frank Ncube as the primary heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Frank Ncube/i }),
    ).toBeInTheDocument();
  });
});
