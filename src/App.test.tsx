import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { act } from "react-dom/test-utils";
import React from "react";

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("App Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    window.localStorage.clear();
  })

  test("Clicking a todo item changes its checked state", async () => {
    render(<App />);
    const todoItems = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(todoItems[0].checked).toBe(false);

    let updatedTodoItems;
    fireEvent.click(todoItems[0]);
    await waitFor(() => {
        updatedTodoItems = screen.getAllByRole("checkbox") as HTMLInputElement[];
        expect(updatedTodoItems[updatedTodoItems.length-1].checked).toBe(true);
    })

    const todoItem = updatedTodoItems[updatedTodoItems.length-1];

    fireEvent.click(todoItem);
    await waitFor(() => {
        updatedTodoItems = screen.getAllByRole("checkbox") as HTMLInputElement[];
        expect(todoItem.checked).toBe(false);
    })
  });

  test("Todo list is correctly saved to local storage", () => {
    render(<App />);
    const todoItems = screen.getAllByRole("checkbox");

    // Simulate checking the first item
    fireEvent.click(todoItems[0]);

    // Verify localStorage has been updated
    const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    expect(savedTodos[savedTodos.length-1].checked).toBe(true);
  });

  test("Todo list is accurately loaded from local storage on start", () => {
    // Preload localStorage with test data
    const testTodos = [
      { id: "1", label: "Test 1", checked: false },
      { id: "2", label: "Test 2", checked: true },
    ];
    localStorage.setItem("todos", JSON.stringify(testTodos));

    render(<App />);
    const todoItems = screen.getAllByRole("checkbox") as HTMLInputElement[];

    // Check that the todos are rendered with correct state
    expect(todoItems[0].checked).toBe(false); // Test 1
    expect(todoItems[1].checked).toBe(true); // Test 2
  });

test("Checked items automatically move to the bottom of the list", async () => {
    render(<App />);
  
    const todoItems = screen.getAllByRole("checkbox") as HTMLInputElement[];
  
    // Ensure the first item is unchecked initially
    expect(todoItems[0].checked).toBe(false);
  
    // Click the first todo item to check it
    fireEvent.click(todoItems[0]);
  
    // Wait for the todos to be reordered
    await waitFor(() => {
      const updatedTodoItems = screen.getAllByRole("checkbox") as HTMLInputElement[];
  
      // The last item should now be checked (since it's moved to the bottom)
      expect(updatedTodoItems[updatedTodoItems.length - 1].checked).toBe(true);
    });
  });

  });
