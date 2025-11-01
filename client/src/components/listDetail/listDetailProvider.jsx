import { createContext, useState, useEffect } from "react";

import FetchHelper from "../../fetch-helper.js";

export const listDetailContext = createContext();

function ListDetailProvider({ children, listID }) {
  const [listDetailDto, setListDetailDto] = useState({
    state: "ready", // one of ready/pending/error
    data: null,
    error: null,
    filter: { checked: false, unchecked: true },
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
          {
            _id: "671f4b2f9a8e7c1234560004",
            name: "Percy Weasley",
            email: "percy.Weasley@gmail.com",
          },
          {
            _id: "671f4b2f9a8e7c1234560005",
            name: "Minerva McGonagall",
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
            _id: "671f4b2f9a8e7c1234561003",
            title: "Mrkve - 5ks",
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
    // mark pending
    setListDetailDto((current) => {
      return { ...current, state: "pending" };
    });

    // create only on FE (no network call)
    // create newItem here so we can return it to caller
    const newId = Math.random().toString(36).substring(2, 9);
    // ensure the item has a state so filtering shows it (default to unchecked)
    const newItem = { ...dtoIn, _id: newId, state: dtoIn.state ?? "unchecked" };

    setListDetailDto((current) => {
      // if no data or no itemList yet, initialize it
      if (!current.data || !Array.isArray(current.data.itemList)) {
        return {
          ...current,
          state: "ready",
          data: { ...(current.data || {}), itemList: [newItem] },
          error: null,
          ok: true,
        };
      }

      // create a new array and add the new item
      const newItemList = current.data.itemList.slice();
      newItemList.push(newItem);

      return {
        ...current,
        state: "ready",
        data: { ...current.data, itemList: newItemList },
        error: null,
        ok: true, // Normally would come from backend response
      };
    });

    // return simulated backend response
    return { ok: true, data: newItem };
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

      return {
        ...current,
        state: "ready",
        data: { ...current.data, itemList: newItemList },
        error: null,
        pendingId: undefined,
      };
    });

    // simulate successful result for caller
    return { ok: true };
  }

  async function handleDelete(dtoIn) {
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

      // create a new array and delete the found item
      const newItemList = current.data.itemList.slice();
      newItemList.splice(itemIndex, 1);

      return {
        ...current,
        state: "ready",
        data: { ...current.data, itemList: newItemList },
        error: null,
        pendingId: undefined,
      };
    });

    // simulate successful result for caller
    return { ok: true };
  }

  // key: "checked" | "unchecked"
  // value: boolen
  async function handleFilterChange(key, value) {
    setListDetailDto((current) => ({
      ...current,
      filter: { ...current.filter, [key]: value },
    }));
  }

  async function handleListUpdate(dtoIn) {
    console.log("here");
    console.log(dtoIn);
    console.log(dtoIn.title);
    // mark pending
    setListDetailDto((current) => {
      return { ...current, state: "pending"};
    });

    // update only on FE (no network call)
    setListDetailDto((current) => {
      return {
        ...current,
        state: "ready",
        error: null,
        data: { ...current.data, title: dtoIn.title },
      };
    });

    // simulate successful result for caller
    return { ok: true };
  }

  const value = {
    ...listDetailDto,
    listID,
    handlerMap: {
      handleLoad,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleFilterChange,
      handleListUpdate,
    },
  };

  return (
    <listDetailContext.Provider value={value}>
      {children}
    </listDetailContext.Provider>
  );
}

export default ListDetailProvider;
