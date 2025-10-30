import { createContext, useState, useEffect } from "react";

import FetchHelper from "../../fetch-helper.js";

export const listDetailContext = createContext();

function ListDetailProvider({ children, listID }) {
  const [listDetailDto, setListDetailDto] = useState({
    state: "ready", // one of ready/pending/error
    data: null,
    error: null,
  });

  async function handleLoad(dtoIn) {
    setListDetailDto((current) => {
      return { ...current, state: "pending" };
    });
    //const result = await FetchHelper.item.listBylistId(dtoIn);

    //--- MOCKUP ---
    // 1 list with its items & members
    const result = {
      ok: true,
      data: {
        _id: "671f4b2f9a8e7c1234567890",
        title: "Grocery Checklist",
        owner: {
          _id: "671f4b2f9a8e7c1234560001",
          name: "Jan novák",
          email: "jan.novak@gmail.com",
        },
        memberList: [
          {
            _id: "671f4b2f9a8e7c1234560002",
            name: "Rubeus Hagrid",
            email: "rubeus.hagrid@gmail.com",
          },
          {
            _id: "671f4b2f9a8e7c1234560003",
            name: "Alastor Moody",
            email: "alastor.moody@gmail.com",
          },
        ],
        itemList: [
          {
            _id: "671f4b2f9a8e7c1234561001",
            title: "Jablka - 5ks",
            state: "unchecked",
          },
          {
            _id: "671f4b2f9a8e7c1234561002",
            title: "Mléko - 2l",
            state: "checked",
          },
        ],

        createdAt: "2025-10-25T14:23:00.000Z",
        updatedAt: "2025-10-30T10:45:00.000Z",
      },
    }; //--- MOCKUP ---
    setListDetailDto((current) => {
      if (result.ok) {
        return { ...current, state: "ready", data: result.data, error: null };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  // to launch load on visiting the Child component (listDetail)
  useEffect(() => {
    handleLoad({ listID: listID });
  }, []);

  async function handleCreate(dtoIn) {
    setListDetailDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.item.create(dtoIn);
    setListDetailDto((current) => {
      if (result.ok) {
        current.data.itemList.push(result.data);
        // returns deep copy of current
        return {
          ...current, // Keeps all existing properties
          state: "ready", // Updates the state property
          // Updates the data property
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null, // Resets the error property
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  async function handleUpdate(dtoIn) {
    const id = dtoIn._id ?? dtoIn.id;
    // mark pending
    setListDetailDto((current) => {
      return { ...current, state: "pending", pendingId: id };
    });

    // update only on FE (no network call)
    setListDetailDto((current) => {
      if (!current.data || !Array.isArray(current.data.itemList)) {
        return { ...current, state: "ready", pendingId: undefined };
      }

      const itemIndex = current.data.itemList.findIndex(
        (item) => item._id === id || item.id === id
      );

      if (itemIndex === -1) {
        // item not found -> clear pending
        return { ...current, state: "ready", pendingId: undefined };
      }

      // create a new array and replace the found item (merge dtoIn)
      const newItemList = current.data.itemList.slice();
      newItemList[itemIndex] = { ...newItemList[itemIndex], ...dtoIn };

      console.log({ ...current.data, itemList: newItemList },)
      return {
        ...current,
        state: "ready",
        data: { ...current.data, itemList: newItemList },
        error: null,
        pendingId: undefined,
      };
    });
  }

  async function handleDelete(dtoIn) {
    setListDetailDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.item.delete(dtoIn);
    setListDetailDto((current) => {
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
        return { ...current, state: "error", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  const value = {
    ...listDetailDto,
    listID,
    handlerMap: { handleLoad, handleCreate, handleUpdate, handleDelete },
  };

  return (
    <listDetailContext.Provider value={value}>
      {children}
    </listDetailContext.Provider>
  );
}

export default ListDetailProvider;
