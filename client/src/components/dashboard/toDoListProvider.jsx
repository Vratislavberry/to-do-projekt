import { createContext, useState, useEffect } from "react";

import FetchHelper from "../../fetch-helper.js";

export const toDoListContext = createContext();

import mockData from "../../mock/mockData.json";
const useMock = process.env.REACT_APP_USE_MOCK === "true";
console.log(useMock ? "Using MOCK" : "Using real BE");

function ToDoListProvider({ children }) {
  const [toDoListDto, setToDoListDto] = useState({
    state: "ready", // one of ready/pending/error
    data: null,
    error: null,
    filter: { active: true, archived: true },
  });

  async function handleLoad() {
    setToDoListDto((current) => ({ ...current, state: "pending" }));
    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = mockData;
      } else {
        result = await FetchHelper.List.list();
      }

      const ok = result?.ok ?? true;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Load failed";
        setToDoListDto((current) => ({
          ...current,
          state: "error",
          error: errMsg,
        }));
        return { ok: false, error: errMsg };
      }

      setToDoListDto((current) => ({
        ...current,
        state: "ready",
        data: result.data,
        curUser: {
          _id: "671f4b2f9a8e7c1234560001",
          name: "Jan Novák",
          email: "jan.novak@gmail.com",
        },
        error: null,
      }));

      return { ok: true, data: result.data };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setToDoListDto((current) => ({ ...current, state: "error", error: msg }));
      return { ok: false, error: msg };
    }
  }

  // to launch load on visiting the Child component (Dashboard)
  useEffect(() => {
    handleLoad();
  }, []);

  async function handleCreate(dtoIn) {
    // mark pending
    setToDoListDto((current) => ({ ...current, state: "pending" }));

    try {
      let resp;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
        const newId = Math.random().toString(36).substring(2, 9);
        const createdObj = { ...dtoIn, _id: newId };
        resp = { ok: true, data: createdObj };
      } else {
        resp = await FetchHelper.List.create(dtoIn);
      }

      const ok = resp?.ok ?? true;
      const created = resp?.data ?? resp;

      if (!ok) {
        const errMsg = resp?.data ?? resp?.error ?? "Create failed";
        setToDoListDto((current) => ({
          ...current,
          state: "error",
          error: errMsg,
        }));
        return { ok: false, error: errMsg };
      }

      // success -> update cache
      setToDoListDto((current) => {
        if (!current.data || !Array.isArray(current.data.ownerOf)) {
          return {
            ...current,
            state: "ready",
            data: { ...(current.data || {}), ownerOf: [created] },
            error: null,
          };
        }
        const newListOfLists = current.data.ownerOf.slice();
        newListOfLists.push(created);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, ownerOf: newListOfLists },
          error: null,
        };
      });

      return { ok: true, data: created };
    } catch (err) {
      // network / unexpected error
      const msg = err?.message ?? String(err);
      setToDoListDto((current) => ({ ...current, state: "error", error: msg }));
      return { ok: false, error: msg };
    }
  }

  // key: "active" | "archived"
  // value: boolean
  async function handleFilterChange(key, value) {
    setToDoListDto((current) => ({
      ...current,
      filter: { ...current.filter, [key]: value },
    }));
  }

  async function handleUpdate(dtoIn) {
    const id = dtoIn._id ?? dtoIn.id;
    setToDoListDto((current) => ({
      ...current,
      state: "pending",
      pendingId: id,
    }));

    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { ok: true, data: dtoIn };
      } else {
        result = await FetchHelper.List.update(dtoIn);
      }

      const ok = result?.ok ?? true;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Update failed";
        setToDoListDto((current) => ({
          ...current,
          state: "error",
          error: errMsg,
          pendingId: undefined,
        }));
        return { ok: false, error: errMsg };
      }

      setToDoListDto((current) => {
        if (!current.data || !Array.isArray(current.data.ownerOf)) {
          return { ...current, state: "ready", pendingId: undefined };
        }

        const itemIndex = current.data.ownerOf.findIndex(
          (item) => item._id === id || item.id === id
        );

        if (itemIndex === -1) {
          return { ...current, state: "ready", pendingId: undefined };
        }

        const newItemList = current.data.ownerOf.slice();
        newItemList[itemIndex] = { ...newItemList[itemIndex], ...dtoIn };

        return {
          ...current,
          state: "ready",
          data: { ...current.data, ownerOf: newItemList },
          error: null,
          pendingId: undefined,
        };
      });

      return { ok: true, data: dtoIn };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setToDoListDto((current) => ({
        ...current,
        state: "error",
        error: msg,
        pendingId: undefined,
      }));
      return { ok: false, error: msg };
    }
  }

  async function handleDelete(dtoIn) {
    const id = dtoIn._id ?? dtoIn.id;
    setToDoListDto((current) => ({
      ...current,
      state: "pending",
      pendingId: id,
    }));

    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { ok: true, data: dtoIn };
      } else {
        result = await FetchHelper.List.delete(dtoIn);
      }

      const ok = result?.ok ?? true;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Delete failed";
        setToDoListDto((current) => ({
          ...current,
          state: "error",
          error: errMsg,
          pendingId: undefined,
        }));
        return { ok: false, error: errMsg };
      }

      setToDoListDto((current) => {
        if (!current.data || !Array.isArray(current.data.ownerOf)) {
          return { ...current, state: "ready", pendingId: undefined };
        }

        const itemIndex = current.data.ownerOf.findIndex(
          (item) => item._id === id || item.id === id
        );

        if (itemIndex === -1) {
          return { ...current, state: "ready", pendingId: undefined };
        }

        const newItemList = current.data.ownerOf.slice();
        newItemList.splice(itemIndex, 1);

        return {
          ...current,
          state: "ready",
          data: { ...current.data, ownerOf: newItemList },
          error: null,
          pendingId: undefined,
        };
      });

      return { ok: true };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setToDoListDto((current) => ({
        ...current,
        state: "error",
        error: msg,
        pendingId: undefined,
      }));
      return { ok: false, error: msg };
    }
  }

  const value = {
    ...toDoListDto,
    handlerMap: {
      handleLoad,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleFilterChange,
    },
  };

  return (
    <toDoListContext.Provider value={value}>
      {children}
    </toDoListContext.Provider>
  );
}

export default ToDoListProvider;
