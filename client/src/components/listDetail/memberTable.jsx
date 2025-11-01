import { useContext, useState, useEffect } from "react";

import { Table, Button } from "react-bootstrap";
import { listDetailContext } from "./listDetailProvider";

function MemberTable({ onClose }) {
  const { state, data, handlerMap } = useContext(listDetailContext);
  return (
    <Table responsive hover>
      <thead className="sticky-top">
        <tr>
          <th>Members</th>
          {data?.owner?._id === "671f4b2f9a8e7c1234560001" && <th>Delete</th>}
        </tr>
      </thead>

      <tbody>
        {data?.memberList.map((member) => (
          <tr key={member._id}>
            <td>{member.name} </td>
            {data?.owner?._id === "671f4b2f9a8e7c1234560001" && (
              <td>
                <Button
                  onClick={async () => {
                    if (
                      !confirm(
                        `Are you sure you want to remove member "${member.name}"?`
                      )
                    ) {
                      return;
                    }
                    const result = await handlerMap.handleMemberDelete({
                      id: member._id,
                    });
                  }}
                  variant="danger"
                  size="sm"
                >
                  Remove
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export default MemberTable;
