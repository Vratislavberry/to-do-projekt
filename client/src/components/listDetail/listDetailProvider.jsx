import { createContext, useState, useEffect } from "react";

import FetchHelper from "../../fetch-helper.js";

import { useLocation } from "react-router-dom";
import users from "../../mock/users.json";
import mockLists from "../../mock/mockLists.json";

export const listDetailContext = createContext();
const useMock = process.env.REACT_APP_USE_MOCK === "true";

function ListDetailProvider({ children, listID }) {
  const location = useLocation();
  const [listDetailDto, setListDetailDto] = useState({
    state: "ready",
    data: null,
    error: null,
    filter: { checked: false, unchecked: true },
  });

  async function handleLoad(dtoIn) {
    setListDetailDto((current) => ({ ...current, state: "pending" }));

    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const preloaded = location?.state?.list;
        const preloadedCurUser = location?.state?.curUser;

        if (preloaded && (preloaded._id === dtoIn.listID || preloaded.id === dtoIn.listID)) {
          // find full version in mockLists (it contains itemList/memberList)
          const fullFromMock = mockLists.find((l) => l._id === dtoIn.listID || l.id === dtoIn.listID) || {};
          const ownerFromState = location?.state?.owner ?? {};

          // merge: prefer explicit fields from navigate-state (preloaded), otherwise take from mock
          const merged = {
            // start from mock (may contain full itemList/memberList)
            ...fullFromMock,
            // overlay preloaded values (title/archived etc.)
            ...preloaded,
            // ensure owner/memberList/itemList exist and prefer preloaded when present
            owner: preloaded.owner ?? ownerFromState ?? fullFromMock.owner ?? {},
            memberList:
              Array.isArray(preloaded.memberList) && preloaded.memberList.length > 0
                ? preloaded.memberList
                : Array.isArray(fullFromMock.memberList)
                ? fullFromMock.memberList
                : [],
            itemList:
              Array.isArray(preloaded.itemList) && preloaded.itemList.length > 0
                ? preloaded.itemList
                : Array.isArray(fullFromMock.itemList)
                ? fullFromMock.itemList
                : [],
          };

          result = {
            ok: true,
            curUserId: preloadedCurUser?._id,
            curUserName: preloadedCurUser?.name,
            data: merged,
          };
        } else {
          const curList = mockLists.find((list) => list._id === dtoIn.listID);
          result = curList
            ? {
                ok: true,
                curUserId: preloadedCurUser?._id,
                curUserName: preloadedCurUser?.name,
                data: curList,
              }
            : {
                ok: true,
                curUserId: preloadedCurUser?._id,
                curUserName: preloadedCurUser?.name,
                data: {
                  _id: dtoIn.listID,
                  title: location?.state?.list?.title ?? "Untitled",
                  owner: location?.state?.owner ?? {},
                  memberList: [],
                  itemList: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              };
        }
      } else {
        result = await FetchHelper.item.listBylistId(dtoIn);
      }

      const ok = result?.ok ?? true;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Load failed";
        setListDetailDto((current) => ({ ...current, state: "error", error: errMsg }));
        return { ok: false, error: errMsg };
      }

      setListDetailDto((current) => ({
        ...current,
        state: "ready",
        data: result.data,
        curUserId: result.curUserId,
        curUserName: result.curUserName,
        error: null,
        users: users,
      }));

      return { ok: true, data: result.data };
    } catch (err) {
      const msg = err?.message ?? String(err);
      console.error("Error in handleLoad:", msg);
      setListDetailDto((current) => ({ ...current, state: "error", error: msg }));
      return { ok: false, error: msg };
    }
  }

  // to launch load on visiting the Child component (listDetail)
  useEffect(() => {
    handleLoad({ listID: listID });
  }, [listID, location.state]);

  async function handleCreate(dtoIn) {
    setListDetailDto((current) => ({ ...current, state: "pending" }));

    try {
      let resp;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newId = Math.random().toString(36).substring(2, 9);
        const newItem = {
          ...dtoIn,
          _id: newId,
          state: dtoIn.state ?? "unchecked",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resp = { ok: true, data: newItem };
      } else {
        resp = await FetchHelper.item.create(dtoIn);
      }

      const ok = resp?.ok ?? true;
      const created = resp?.data ?? resp;

      if (!ok) {
        const errMsg = resp?.data ?? resp?.error ?? "Create failed";
        setListDetailDto((current) => ({ ...current, state: "error", error: errMsg }));
        return { ok: false, error: errMsg };
      }

      setListDetailDto((current) => {
        if (!current.data || !Array.isArray(current.data.itemList)) {
          return {
            ...current,
            state: "ready",
            data: { ...(current.data || {}), itemList: [created] },
            error: null,
          };
        }
        const newItemList = current.data.itemList.slice();
        newItemList.push(created);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: newItemList },
          error: null,
        };
      });

      return { ok: true, data: created };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setListDetailDto((current) => ({ ...current, state: "error", error: msg }));
      return { ok: false, error: msg };
    }
  }

  async function handleUpdate(dtoIn) {
    const id = dtoIn._id ?? dtoIn.id;
    setListDetailDto((current) => ({ ...current, state: "pending", pendingId: id }));

    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { ok: true, data: dtoIn };
      } else {
        result = await FetchHelper.item.update(dtoIn);
      }

      const ok = result?.ok ?? true;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Update failed";
        setListDetailDto((current) => ({ ...current, state: "error", error: errMsg, pendingId: undefined }));
        return { ok: false, error: errMsg };
      }

      setListDetailDto((current) => {
        if (!current.data || !Array.isArray(current.data.itemList)) {
          return { ...current, state: "ready", pendingId: undefined };
        }

        const itemIndex = current.data.itemList.findIndex(
          (item) => item._id === id || item.id === id
        );

        if (itemIndex === -1) {
          return { ...current, state: "ready", pendingId: undefined };
        }

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

      return { ok: true };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setListDetailDto((current) => ({ ...current, state: "error", error: msg, pendingId: undefined }));
      return { ok: false, error: msg };
    }
  }

  async function handleDelete(dtoIn) {
    const id = dtoIn._id ?? dtoIn.id;
    setListDetailDto((current) => ({ ...current, state: "pending", pendingId: id }));

    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { ok: true, data: dtoIn };
      } else {
        result = await FetchHelper.item.delete(dtoIn);
      }

      const ok = result?.ok ?? true;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Delete failed";
        setListDetailDto((current) => ({ ...current, state: "error", error: errMsg, pendingId: undefined }));
        return { ok: false, error: errMsg };
      }

      setListDetailDto((current) => {
        if (!current.data || !Array.isArray(current.data.itemList)) {
          return { ...current, state: "ready", pendingId: undefined };
        }

        const itemIndex = current.data.itemList.findIndex(
          (item) => item._id === id || item.id === id
        );

        if (itemIndex === -1) {
          return { ...current, state: "ready", pendingId: undefined };
        }

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

      return { ok: true };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setListDetailDto((current) => ({ ...current, state: "error", error: msg, pendingId: undefined }));
      return { ok: false, error: msg };
    }
  }

  // key: "checked" | "unchecked"
  // value: boolean
  async function handleFilterChange(key, value) {
    setListDetailDto((current) => ({
      ...current,
      filter: { ...current.filter, [key]: value },
    }));
  }

  async function handleListUpdate(dtoIn) {
    setListDetailDto((current) => ({ ...current, state: "pending" }));

    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { ok: true, data: dtoIn };
      } else {
        result = await FetchHelper.list.update(dtoIn);
      }

      const ok = result?.ok ?? true;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Update failed";
        setListDetailDto((current) => ({ ...current, state: "error", error: errMsg }));
        return { ok: false, error: errMsg };
      }

      setListDetailDto((current) => ({
        ...current,
        state: "ready",
        data: { ...current.data, title: dtoIn.title },
        error: null,
      }));

      return { ok: true };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setListDetailDto((current) => ({ ...current, state: "error", error: msg }));
      return { ok: false, error: msg };
    }
  }

  async function handleMemberDelete(dtoIn) {
    const id = dtoIn._id ?? dtoIn.id;
    setListDetailDto((current) => ({ ...current, state: "pending", pendingId: id }));

    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { ok: true, data: dtoIn };
      } else {
        result = await FetchHelper.member.delete(dtoIn);
      }

      const ok = result?.ok ?? true;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Delete failed";
        setListDetailDto((current) => ({ ...current, state: "error", error: errMsg, pendingId: undefined }));
        return { ok: false, error: errMsg };
      }

      setListDetailDto((current) => {
        if (!current.data || !Array.isArray(current.data.memberList)) {
          return { ...current, state: "ready", pendingId: undefined };
        }

        const memberIndex = current.data.memberList.findIndex(
          (item) => item._id === id || item.id === id
        );

        if (memberIndex === -1) {
          return { ...current, state: "ready", pendingId: undefined };
        }

        const newMemberList = current.data.memberList.slice();
        newMemberList.splice(memberIndex, 1);

        return {
          ...current,
          state: "ready",
          data: { ...current.data, memberList: newMemberList },
          error: null,
          pendingId: undefined,
        };
      });

      return { ok: true };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setListDetailDto((current) => ({ ...current, state: "error", error: msg, pendingId: undefined }));
      return { ok: false, error: msg };
    }
  }

  async function handleMemberAdd(dtoIn) {
    setListDetailDto((current) => ({ ...current, state: "pending" }));

    try {
      let result;
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = { ok: true, data: dtoIn.member };
      } else {
        result = await FetchHelper.member.add(dtoIn);
      }

      const ok = result?.ok ?? true;
      const created = result?.data ?? result;

      if (!ok) {
        const errMsg = result?.data ?? result?.error ?? "Add member failed";
        setListDetailDto((current) => ({ ...current, state: "error", error: errMsg }));
        return { ok: false, error: errMsg };
      }

      setListDetailDto((current) => {
        if (!current.data || !Array.isArray(current.data.memberList)) {
          return {
            ...current,
            state: "ready",
            data: { ...(current.data || {}), memberList: [created] },
            error: null,
          };
        }
        const newMemberList = current.data.memberList.slice();
        newMemberList.push(created);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, memberList: newMemberList },
          error: null,
        };
      });

      return { ok: true, data: created };
    } catch (err) {
      const msg = err?.message ?? String(err);
      setListDetailDto((current) => ({ ...current, state: "error", error: msg }));
      return { ok: false, error: msg };
    }
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
      handleMemberDelete,
      handleMemberAdd,
    },
  };

  return (
    <listDetailContext.Provider value={value}>
      {children}
    </listDetailContext.Provider>
  );
}

export default ListDetailProvider;
