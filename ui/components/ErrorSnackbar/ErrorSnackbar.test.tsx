import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@mui/material", () => ({
    Snackbar: ({ open, children }: any) =>
        open ? <div data-testid="snackbar">{children}</div> : null,

    Alert: ({ children }: any) => (
        <div role="alert">{children}</div>
    ),
}));

import { ErrorSnackbar } from "./ErrorSnackbar";

describe("ErrorSnackbar", () => {
    it("does not render when isError is false", () => {
        render(<ErrorSnackbar isError={false} />);

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("renders when isError is true", () => {
        render(<ErrorSnackbar isError={true} />);

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("renders custom message", () => {
        render(<ErrorSnackbar isError={true} message="Timeout error" />);

        expect(screen.getByText("Timeout error")).toBeInTheDocument();
    });

    it("opens again when isError toggles from false to true", () => {
        const { rerender } = render(<ErrorSnackbar isError={false} />);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();

        rerender(<ErrorSnackbar isError={true} />);
        expect(screen.getByRole("alert")).toBeInTheDocument();
    });
});
