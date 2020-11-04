import React, { useState } from "react";
import { Table } from "../../common/Table/Table";
import { db } from "../../api/firebase"
import { Button, Modal, Segment, Form, Input } from "semantic-ui-react";
import { Formik } from 'formik';
import * as Yup from 'yup';

export function Speciality(props) {
    const [data, setdata] = useState([])

    const [open, setOpen] = React.useState(false)
    const [modalValues, setModalValues] = React.useState({})

    const loadData = () => {
        db.collection("speciality").get()
            .then(function (querySnapshot) {
                if (querySnapshot.empty) {
                    setdata([])
                }
                console.log("Speciality -> querySnapshot", querySnapshot)
                const dataSnapshot = []
                querySnapshot.forEach((d) => {
                    dataSnapshot.push({ ...d.data(), id: d.id })
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
        db.collection('speciality').doc(row.original.id).delete().then(function () {
            console.log("Document successfully deleted!");
            loadData()
        }).catch(function (error) {
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
        {
            Header: 'Направление',
            accessor: 'NameSpeciality',
        },
        {
            Header: 'Профиль',
            accessor: 'Profile',
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

    const clickOk = (values) => {
        if (modalValues.id) {
            db.collection('speciality').doc(modalValues.id).set({
                NameSpeciality: values.NameSpeciality,
                Profile: values.Profile,
            }).then(function () {
                console.log("Document successfully written!");
                setOpen(false)
                loadData()
            });
        } else {
            db.collection('speciality').doc().set({
                NameSpeciality: values.NameSpeciality,
                Profile: values.Profile,
            }).then(function () {
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
                <Formik
                    initialErrors={{
                        NameSpeciality: "",
                        Profile: "",
                    }}
                    initialValues={{
                        NameSpeciality: modalValues.NameSpeciality || '',
                        Profile: modalValues.Profile || '',
                    }}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
                    validationSchema={Yup.object({
                        NameSpeciality: Yup.string().required('Обязательно для заполнения!'),
                        Profile: Yup.string().required('Обязательно для заполнения!'),
                    })}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isValid,
                        /* and other goodies */
                    }) => (
                            <>
                                <Modal.Content>
                                    <Modal.Description>
                                        <Form>
                                            <Form.Field>
                                                <label>Направление</label>
                                                <Input
                                                    id="NameSpeciality"
                                                    name="NameSpeciality"
                                                    type="NameSpeciality"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.NameSpeciality}
                                                    error={touched.NameSpeciality && errors.NameSpeciality ? {
                                                        content: errors.NameSpeciality,
                                                        pointing: 'below',
                                                    } : false}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Профиль</label>
                                                <Input
                                                    id="Profile"
                                                    name="Profile"
                                                    type="Profile"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.Profile}
                                                    error={touched.Profile && errors.Profile ? {
                                                        content: errors.Profile,
                                                        pointing: 'below',
                                                    } : false}
                                                />
                                            </Form.Field>
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
                                        onClick={() => clickOk(values)}
                                        positive
                                        disabled={!isValid}
                                    />
                                </Modal.Actions>
                            </>
                        )}
                </Formik>
            </Modal>
        </>
    )
}
