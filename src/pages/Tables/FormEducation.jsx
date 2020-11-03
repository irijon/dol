import React, { useState } from "react";
import { Table } from "../../common/Table/Table";
import { Button, Modal, Segment, Form, Input } from "semantic-ui-react";
import { db } from "../../api/firebase"

export function FormEducation(props) {
    const [data, setdata] = useState([])

    const [open, setOpen] = React.useState(false)
    const [modalValues, setModalValues] = React.useState({})

    const loadData = () => {
        db.collection("formEducation").get()
            .then(function (querySnapshot) {
                if (querySnapshot.empty) {
                    setdata([])
                }
                console.log("Speciality -> querySnapshot", querySnapshot)
                const dataSnapshot=[]
                querySnapshot.forEach((d)=>{
                    dataSnapshot.push({...d.data(), id: d.id})
                })
                setdata(dataSnapshot)
                console.log("Speciality -> dataSnapshot", dataSnapshot)
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    React.useEffect(() => {
        loadData()
    }, [])

    const handleClickDelete = (row) => {
        db.collection('formEducation').doc(row.original.id).delete().then(function() {
            console.log("Document successfully deleted!");
            loadData()
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });        
    }

    const handleClickEdit = (row) => {
        setOpen(true)
        setModalValues(row.original)
        console.log("handleClickDelete -> values", row)
    }

    const handleClickAdd = () => {
        setOpen(true)
        setModalValues({})
    }

    const columns = [
        /*{
            Header: 'FormEducationId',
            accessor: 'FormEducationId',
            isVisible: false,
        },*/
        {
            Header: 'Форма обучения',
            accessor: 'NameForm',
        },
        {
            id: "edit",
            Cell: ({ row }) => (
                <Button paddied onClick={() => handleClickEdit(row)} content='Редактировать' color='green' icon="edit outline" {...row.getToggleRowSelectedProps()}></Button>
            ),
        },
        {
            id: "delete",
            Cell: ({ row }) => (
                <Button onClick={() => handleClickDelete(row)} content='Удалить' color='grey' icon="trash alternate outline" {...row.getToggleRowSelectedProps()}></Button>
            ),
        }
    ]

    const onChangeModalForm = (property, value) => {
        console.log("onChangeModalForm -> property, value", property, value)
        const newState = { ...modalValues }
        property.forEach((i, num) => {
            newState[i] = value[num]
        })
        setModalValues(newState)
        console.log("onChangeModalForm -> newState", newState)
    }

    const clickOk = () => {
        if (modalValues.id) {
            db.collection('formEducation').doc(modalValues.id).set({
                NameForm: modalValues.NameForm
        }).then(function() {
            console.log("Document successfully written!");
            setOpen(false)
            loadData()
        });
        } else {
            db.collection('formEducation').doc().set({
                NameForm: modalValues.NameForm
            }).then(function() {
                console.log("Document successfully written!");
                setOpen(false)
                loadData()
            });
        }
        
    }

    return (
        <>
            <Segment>
                <Button onClick={handleClickAdd} content='Добавить' icon='plus' primary></Button>
            </Segment>
            <Table columns={columns} data={data}></Table>
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field><label>Форма обучения</label><Input onChange={(e, data) => { onChangeModalForm(['NameForm'], [data.value]) }} value={modalValues.NameForm||''} /></Form.Field>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        content="Изменить"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => clickOk()}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </>
    )
}
