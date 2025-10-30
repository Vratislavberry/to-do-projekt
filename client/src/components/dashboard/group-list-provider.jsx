import { createContext, useState, useEffect } from "react";

import FetchHelper from "../../fetch-helper.js";

export const GroupListContext = createContext();

function GroupListProvider({ children }) {
  const [groupListDto, setGroupListDto] = useState({
    state: "ready", // one of ready/pending/error
    data: null,
    error: null,
  });

  async function handleLoad() {
    setGroupListDto((current) => {
      return { ...current, state: "pending" };
    });
    let result = await FetchHelper.group.list();

    // sort data alphabeticaly
    const sortedResultData = result?.data?.itemList?.sort((a, b) => a.title.localeCompare(b.title));
    result.data.itemList = sortedResultData;
    
    setGroupListDto((current) => {
      if (result.ok) {
        return { ...current, state: "ready", data: result.data, error: null };
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
    setGroupListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.group.create(dtoIn);
    setGroupListDto((current) => {
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
        // state needs to be ready on error or no data is shown
        return { ...current, state: "ready", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  
  async function handleUpdate(dtoIn) {
    setGroupListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.group.update(dtoIn);
    setGroupListDto((current) => {
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
    setGroupListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.group.delete(dtoIn);
    setGroupListDto((current) => {
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
    ...groupListDto,
    handlerMap: { handleLoad, handleCreate, handleUpdate, handleDelete},
  };


  return (
    <GroupListContext.Provider value={value}>
      {children}
    </GroupListContext.Provider>
  );
}

export default GroupListProvider;
