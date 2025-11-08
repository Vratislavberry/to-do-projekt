import { createContext, useState, useEffect } from "react";

import FetchHelper from "../../fetch-helper.js";

export const toDoListContext = createContext();

function ToDoListProvider({ children }) {
  const [toDoListDto, setToDoListDto] = useState({
    state: "ready", // one of ready/pending/error
    data: null,
    error: null,
  });

  async function handleLoad() {
    setToDoListDto((current) => {
      return { ...current, state: "pending" };
    });
    //const result = await FetchHelper.item.listBylistId(dtoIn);

    //--- MOCKUP ---
    // 1 list with its items & members
    const result = {
      ok: true,
      data: {
        ownerOf: [
          {
            _id: "671f4b2f9a8e7c1234567890",
            title: "Grocery Checklist",
            archived: false,
            createdAt: "2025-11-07T13:44:25+00:00",
            updatedAt: "2025-11-07T13:44:25+00:00",
          },
          {
            _id: "771f4b2f9a8e7c1234567890",
            title: "Italian Checklist",
            archived: false,
            createdAt: "2025-11-07T13:44:25+00:00",
            updatedAt: "2025-11-07T13:44:25+00:00",
          },
        ],
        memberOf: [
          {
            _id: "771f4b2f9a8e7c1234567891",
            title: "Electronic store Checklist",
            archived: false,
            createdAt: "2025-11-07T13:44:25+00:00",
            updatedAt: "2025-11-07T13:44:25+00:00",
            owner: {
              _id: "671f4b2f9a8e7c1234560002",
              name: "Rubeus Hagrid",
              email: "rubeus.hagrid@gmail.com",
            },
          },
        ],
      },
    }; //--- MOCKUP ---
    setToDoListDto((current) => {
      if (result.ok) {
        return {
          ...current,
          state: "ready",
          data: result.data,
          curUser: {
            _id: "671f4b2f9a8e7c1234560001",
            name: "Jan novák",
            email: "jan.novak@gmail.com",
          },
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  // to launch load on visiting the Child component (Dashboard)
  useEffect(() => {
    handleLoad();
  }, []);

  async function handleCreate(dtoIn) {
    // mark pending
    setToDoListDto((current) => {
      return { ...current, state: "pending" };
    });

    // create only on FE (no network call)
    // create new List here so we can return it to caller
    const newId = Math.random().toString(36).substring(2, 9);
    const newList = { ...dtoIn, _id: newId };

    setToDoListDto((current) => {
      // if no data or no List yet, initialize it
      if (!current.data || !Array.isArray(current.data.ownerOf)) {
        return {
          ...current,
          state: "ready",
          data: { ...(current.data || {}), ownerOf: [newList] },
          error: null,
          ok: true,
        };
      }

      // create a new array and add the new item
      const newListOfLists = current.data.ownerOf.slice();
      newListOfLists.push(newList);

      return {
        ...current,
        state: "ready",
        data: { ...current.data, ownerOf: newListOfLists },
        error: null,
        ok: true, // Normally would come from backend response
      };
    });

    // return simulated backend response
    return { ok: true, data: newList };
  }

  async function handleUpdate(dtoIn) {
    setToDoListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.group.update(dtoIn);
    setToDoListDto((current) => {
      // finding index of updated item in the list
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList[itemIndex] = dtoIn;
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
          pendingId: undefined,
        };
      } else {
        // state needs to be ready on error or no data is shown
        return {
          ...current,
          state: "ready",
          error: result.data,
          pendingId: undefined,
        };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  async function handleDelete(dtoIn) {
    setToDoListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.group.delete(dtoIn);
    setToDoListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList.splice(itemIndex, 1);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
        };
      } else {
        // state needs to be ready on error or no data is shown
        return { ...current, state: "ready", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  const value = {
    ...toDoListDto,
    handlerMap: { handleLoad, handleCreate },
  };

  return (
    <toDoListContext.Provider value={value}>
      {children}
    </toDoListContext.Provider>
  );
}

export default ToDoListProvider;
