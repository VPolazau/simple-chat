import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MessageRow } from "./MessageRow";

const createRowProps = (overrides: Partial<any> = {}) => ({
    index: 0,
    style: { top: 0 },
    items: [],
    ariaAttributes: {
        role: "listitem" as const,
        "aria-posinset": 1,
        "aria-setsize": 1,
    },
    ...overrides,
});

describe("MessageRow", () => {
    it("renders empty Box when message does not exist", () => {
        const { container } = render(
            <MessageRow {...createRowProps()} />
        );

        expect(container.querySelector(".MuiPaper-root")).not.toBeInTheDocument();
    });

    it("renders message text", () => {
        render(
            <MessageRow
                {...createRowProps({
                    items: [
                        {
                            id: "1",
                            author: "me",
                            text: "Hello world",
                            createdAt: "2024-01-01T10:15:00Z",
                        },
                    ],
                })}
            />
        );

        expect(screen.getByText("Hello world")).toBeInTheDocument();
    });

    it("aligns message to the right when author is me", () => {
        const { container } = render(
            <MessageRow
                {...createRowProps({
                    items: [
                        {
                            id: "1",
                            author: "me",
                            text: "My message",
                            createdAt: "2024-01-01T10:15:00Z",
                        },
                    ],
                })}
            />
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveStyle({ justifyContent: "flex-end" });
    });

    it("aligns message to the left when author is not me", () => {
        const { container } = render(
            <MessageRow
                {...createRowProps({
                    items: [
                        {
                            id: "1",
                            author: "Alice",
                            text: "Other message",
                            createdAt: "2024-01-01T10:15:00Z",
                        },
                    ],
                })}
            />
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveStyle({ justifyContent: "flex-start" });
    });

    it("applies opacity for optimistic message", () => {
        const { container } = render(
            <MessageRow
                {...createRowProps({
                    items: [
                        {
                            id: "1",
                            author: "me",
                            text: "Sending...",
                            createdAt: "2024-01-01T10:15:00Z",
                            isOptimistic: true,
                        },
                    ],
                })}
            />
        );

        const paper = container.querySelector(".MuiPaper-root") as HTMLElement;
        expect(paper).toHaveStyle({ opacity: "0.6" });
    });
});
