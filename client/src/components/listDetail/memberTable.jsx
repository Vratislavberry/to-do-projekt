import { useContext, useState, useEffect } from "react";

import { Table, Button } from "react-bootstrap";
import { listDetailContext } from "./listDetailProvider";

function MemberTable({ onClose }) {
  const { state, data, handlerMap, curUserId } = useContext(listDetailContext);
  return (
    <Table responsive hover>
      <thead className="sticky-top">
        <tr>
          <th>Members</th>
          <th>Remove</th>
        </tr>
      </thead>

      <tbody>
        {data?.memberList.map((member) => (
          <tr key={member._id}>
            <td>{member.name} </td>
            {data?.owner?._id === curUserId || member._id === curUserId ? (
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
            ) : (
              <td></td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export default MemberTable;
