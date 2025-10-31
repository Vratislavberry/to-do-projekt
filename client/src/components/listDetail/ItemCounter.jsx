import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";

function ItemCounter() {
  const { data } = useContext(listDetailContext);

  return (
    <>
      {data?.itemList?.reduce(
        (accum, item) => (item.state === "checked" ? accum + 1 : accum),
        0
      )}{" "}
      / {data?.itemList?.length} items checked
    </>
  );
}

export default ItemCounter;
