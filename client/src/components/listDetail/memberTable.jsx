import { useContext, useState, useEffect, useMemo } from "react";

import { Table, Button, Form } from "react-bootstrap";
import { listDetailContext } from "./listDetailProvider";
import { useNavigate } from "react-router-dom";

function MemberTable({ onClose }) {
  const navigate = useNavigate();
  const { state, data, handlerMap, curUserId, users } =
    useContext(listDetailContext);
  const [selectedUser, setSelectedUser] = useState("");

  // memoize availableUsers so reference is stable unless inputs change
  const availableUsers = useMemo(
    () =>
      (users || []).filter(
        (u) =>
          !(data?.memberList || []).some((m) => m._id === u._id) &&
          u._id !== curUserId
      ),
    [users, data?.memberList, curUserId]
  );

  // initialize selectedUser only when it's empty (don't reset on every render)
  useEffect(() => {
    if (!selectedUser) {
      setSelectedUser(availableUsers[0]?._id ?? "");
    }
  }, [availableUsers, selectedUser]);

  async function onAddMember(e) {
    e?.preventDefault?.();
    if (!selectedUser) return;
    const userObj = (users || []).find((u) => u._id === selectedUser);
    if (!userObj) return;

    if (handlerMap?.handleMemberAdd) {
      const res = await handlerMap.handleMemberAdd({ member: userObj });
      // optionally update selection after successful add
      if (res?.ok) {
        // set to next available user or empty
        const next = availableUsers.find((u) => u._id !== selectedUser);
        setSelectedUser(next?._id ?? "");
      }
    } else {
      data.memberList.push(userObj);
      // update selection similarly
      const next = availableUsers.find((u) => u._id !== selectedUser);
      setSelectedUser(next?._id ?? "");
    }
  }

  return (
    <Table responsive hover>
      <thead className="sticky-top">
        { data?.memberList.length > 0 &&
          <tr>
            <th>Members</th>
            <th>Remove</th>
          </tr>
        }
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
                    if (curUserId === member._id && result?.ok) {
                      navigate("/");
                    }
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
        {/* Add member row, only visible to owner */}
        {curUserId === data?.owner?._id && (
          <tr className="table-success">
            <td colSpan={2}>
              <Form
                onSubmit={onAddMember}
                className="d-flex gap-2 align-items-center"
              >
                <Form.Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  aria-label="Select user to add"
                  disabled={availableUsers.length === 0}
                >
                  {availableUsers.length === 0 ? (
                    <option value="">No users available</option>
                  ) : (
                    availableUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))
                  )}
                </Form.Select>

                <Button
                  type="submit"
                  variant="success"
                  disabled={!selectedUser}
                  size="sm"
                >
                  Add
                </Button>
              </Form>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
export default MemberTable;
