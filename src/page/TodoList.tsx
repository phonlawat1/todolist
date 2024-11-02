import React, { useReducer, useEffect, useRef } from "react";

type Props = {};

type Item = {
  type: "Fruit" | "Vegetable";
  name: string;
};

const initialItems: Item[] = [
  { type: "Fruit", name: "Apple" },
  { type: "Vegetable", name: "Broccoli" },
  { type: "Vegetable", name: "Mushroom" },
  { type: "Fruit", name: "Banana" },
  { type: "Vegetable", name: "Tomato" },
  { type: "Fruit", name: "Orange" },
  { type: "Fruit", name: "Mango" },
  { type: "Fruit", name: "Pineapple" },
  { type: "Vegetable", name: "Cucumber" },
  { type: "Fruit", name: "Watermelon" },
  { type: "Vegetable", name: "Carrot" },
];

type State = {
  uncategorizedItems: Item[];
  fruits: Item[];
  vegetables: Item[];
};

type Action =
  | { type: "ADD_TO_CATEGORY"; item: Item }
  | { type: "REMOVE_FROM_CATEGORY"; item: Item }
  | { type: "RESET_ITEM"; item: Item };

const reducer = (state: State, action: Action): State => {
  const categoryKey = (action.item.type.toLowerCase() + "s") as keyof State;
  switch (action.type) {
    case "ADD_TO_CATEGORY":
      return {
        ...state,
        uncategorizedItems: state.uncategorizedItems.filter(
          (i) => i !== action.item
        ),
        [categoryKey]: [...state[categoryKey], action.item],
      };
    case "REMOVE_FROM_CATEGORY":
      return {
        ...state,
        [categoryKey]: state[categoryKey].filter((i) => i !== action.item),
        uncategorizedItems: [...state.uncategorizedItems, action.item],
      };
    case "RESET_ITEM":
      return {
        ...state,
        [categoryKey]: state[categoryKey].filter((i) => i !== action.item),
        uncategorizedItems: [...state.uncategorizedItems, action.item],
      };
    default:
      return state;
  }
};

function TodoList({}: Props) {
  const [state, dispatch] = useReducer(reducer, {
    uncategorizedItems: initialItems,
    fruits: [],
    vegetables: [],
  });

  const timers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const setResetTimer = (item: Item) => {
    const timer = setTimeout(() => {
      dispatch({ type: "RESET_ITEM", item });
      timers.current.delete(item.name);
    }, 5000);

    timers.current.set(item.name, timer);
  };

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleItemClick = React.useCallback((item: Item) => {
    dispatch({ type: "ADD_TO_CATEGORY", item });
    setResetTimer(item);
  }, []);

  const handleCategoryItemClick = React.useCallback((item: Item) => {
    dispatch({ type: "REMOVE_FROM_CATEGORY", item });
    const timer = timers.current.get(item.name);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(item.name);
    }
  }, []);

  const renderItems = (items: Item[], onClick: (item: Item) => void) =>
    items.map((item, index) => (
      <button
        key={index}
        style={styles.itemButton}
        onClick={() => onClick(item)}
      >
        {item.name}
      </button>
    ));

  return (
    <div style={styles.container}>
      <div style={styles.column}>
        <h3>Items</h3>
        {renderItems(state.uncategorizedItems, handleItemClick)}
      </div>
      <div style={styles.column}>
        <h3>Fruit</h3>
        {renderItems(state.fruits, handleCategoryItemClick)}
      </div>
      <div style={styles.column}>
        <h3>Vegetable</h3>
        {renderItems(state.vegetables, handleCategoryItemClick)}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    padding: "20px",
  },
  column: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center" as "center",
  },
  itemButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    background: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default TodoList;
