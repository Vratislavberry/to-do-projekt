import { useContext, useState, useEffect } from "react";

import { Table, Button } from "react-bootstrap";
import { listDetailContext } from "./listDetailProvider";

function MemberTable({ onClose }) {
  const { state, data } = useContext(listDetailContext);
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
                <Button variant="danger" size="sm">Delete</Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export default MemberTable;
