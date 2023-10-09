import { render, screen } from "@testing-library/react";
import React from "react";
import App from "../App";

test.skip("App rendering", () => {
    render(<App />);
    const linkelement = screen.getByRole("heading");
    expect(linkelement).toBeInTheDocument();
});
