import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import database from "./database.json";
import { useEffect, useState } from "react";
import { fetchUserData, fetchTodoData, updateTodoStatus } from "./api";

function App() {
  const [dataUser, setDataUser] = useState(database.user);
  const [dataTodo, setDataTodo] = useState(database.todo);

  //FILTER state
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filterCompleted = ["Finished", "Unfinished", "All"];

  //HANDLE ASCENDING
  const handleAscendingByTitle = () => {
    setDataTodo([...dataTodo].sort((a, b) => a.title.localeCompare(b.title)));
  };

  //HANDLE JOIN TABLE
  const getUserName = (userId) => {
    const user = dataUser.find((user) => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  //HANDLE FILTER
  //filter by user
  const handleUserCheckboxChange = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  //filter by completed
  const handleStatusRadioChange = (status) => {
    setSelectedStatus(status);
  };

  const filterDataTodo = () => {
    if (selectedUsers.length === 0) {
      return dataTodo.filter((item) => {
        if (selectedStatus === "All") {
          return true;
        }
        return selectedStatus === "Finished" ? item.completed : !item.completed;
      });
    }
    return dataTodo
      .filter((item) => selectedUsers.includes(item.userId))
      .filter((item) => {
        if (selectedStatus === "All") {
          return true;
        }
        return selectedStatus === "Finished" ? item.completed : !item.completed;
      });
  };

  //HANDLE CHANGE STATUS
  const handleChangeStatus = async (todoId, item, completed) => {
    try {
      await updateTodoStatus(todoId, item, !completed);

      setDataTodo((prevDataTodo) => {
        return prevDataTodo.map((item) =>
          item.id === todoId ? { ...item, completed: !completed } : item
        );
      });
    } catch (error) {
      console.error("Error changing todo status:", error);
    }
  };

  useEffect(() => {
    setSelectedStatus("All");
  }, []);

  //CALL API TO GET DATA
  useEffect(() => {
    fetchUserData().then((userData) => setDataUser(userData));
    fetchTodoData().then((todoData) => setDataTodo(todoData));
  }, []);

  return (
    <Container>
      <Row>
        <Col sm={8}>
          <h4>Todo List</h4>

          <Row className="mb-3">
            <p>Sort: </p>
            <Button variant="primary" onClick={handleAscendingByTitle}>
              Ascending by Title
            </Button>
          </Row>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Title</th>
                <th>User</th>
                <th>Completed</th>
                <th>Change status</th>
              </tr>
            </thead>
            <tbody>
              {filterDataTodo()?.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{getUserName(item.userId)}</td>
                  <td>
                    {item.completed ? (
                      <p className="text-primary fw-bold">Finished</p>
                    ) : (
                      <p className="text-danger fw-bold">Unfinished</p>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() =>
                        handleChangeStatus(item.id, item, item.completed)
                      }
                    >
                      Change
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col sm={4}>
          <div className="mb-4">
            <h4>User</h4>
            {dataUser?.map((item, index) => (
              <div key={index} className="mb-3">
                <Form.Check
                  type="checkbox"
                  id={item.id}
                  label={item.name}
                  name="dataUser"
                  checked={selectedUsers.includes(item.id)}
                  onChange={() => handleUserCheckboxChange(item.id)}
                />
              </div>
            ))}
          </div>

          <div>
            <h4>Completed</h4>
            {filterCompleted.map((item, index) => (
              <div key={index} className="mb-3">
                <Form.Check
                  type={"radio"}
                  id={item}
                  label={item}
                  name="filterCompleteds"
                  checked={selectedStatus === item}
                  onChange={() => handleStatusRadioChange(item)}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
