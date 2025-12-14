import { render, screen, fireEvent } from "@testing-library/react";
import { ChatListItem } from "./ChatListItem";
import type { IChatListItemProps } from "./ChatListItem.declarations";

const defaultProps: IChatListItemProps = {
    id: "chat_1",
    name: "Alice Johnson",
    avatar: "https://example.com/avatar.jpg",
    lastMessage: "See you tomorrow!",
    selected: false,
    onClick: jest.fn(),
};

describe("ChatListItem", () => {
    it("renders chat name and last message", () => {
        render(<ChatListItem {...defaultProps} />);

        expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
        expect(screen.getByText("See you tomorrow!")).toBeInTheDocument();
    });

    it("calls onClick with chat id when clicked", () => {
        const onClick = jest.fn();

        render(
            <ChatListItem
                {...defaultProps}
                onClick={onClick}
            />
        );

        fireEvent.click(screen.getByRole("button"));

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith("chat_1");
    });

    it("marks item as selected", () => {
        render(
            <ChatListItem
                {...defaultProps}
                selected
            />
        );

        const button = screen.getByRole("button");

        expect(button).toHaveClass("Mui-selected");
    });

    it("renders avatar with correct alt text", () => {
        render(<ChatListItem {...defaultProps} />);

        const avatar = screen.getByAltText("Alice Johnson");

        expect(avatar).toBeInTheDocument();
    });
});
