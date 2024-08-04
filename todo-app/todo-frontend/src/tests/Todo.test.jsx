import { render, screen } from "@testing-library/react";
import TodoList from "../Todos/List";
import { describe, expect, it, vi } from "vitest";

describe("Test TodoList component", () => {
  it("render a list of todo should have the text", async () => {
    const todos = [
      {
        text: "this is a test todo",
        done: false,
      }
    ];

    const deleteTodo = vi.fn();
    const completeTodo = vi.fn();
    render(
      <TodoList
        todos={todos}
        deleteTodo={deleteTodo}
        completeTodo={completeTodo}
      />
    );

    expect(screen.getByText(todos[0].text)).toBeInTheDocument();
    expect(screen.getByText("This todo is not done")).toBeInTheDocument();
    expect(screen.getByText("Set as done")).toBeInTheDocument();
  });
});
