import React, { useState } from "react";
import { Table } from "../../common/Table/Table";
import { db } from "../../api/firebase";
import { Button, Dropdown, Modal, Segment, Form, Input } from "semantic-ui-react";

export function Group(props) {
    const [data, setdata] = useState([])
    const [open, setOpen] = React.useState(false)
    const [modalValues, setModalValues] = React.useState({})
    const [optionsFormEducation, setoptionsFormEducation] = React.useState([])
    const [optionsQualification, setoptionsQualification] = React.useState([])
    const [optionsSpeciality, setoptionsSpeciality] = React.useState([])

    const loadData = () => {
        db.collection("groups").get()
            .then(function (querySnapshot) {
                if (querySnapshot.empty) {
                    setdata([])
                }
                const dataSnapshot = []
                querySnapshot.forEach((d) => {
                    let fullData = { ...d.data(), id: d.id }
                    let countPromice = 0
                    fullData.IdFormEducation.get().then((v) => {
                        countPromice++
                        fullData = { ...fullData, ...v.data(), IdFormEducationStr: v.id }
                        if (countPromice === 3) {
                            dataSnapshot.push(fullData)
                            setdata([...dataSnapshot])
                        }
                    })
                    fullData.IdQualification.get().then((v) => {
                        countPromice++
                        fullData = { ...fullData, ...v.data(), IdQualificationStr: v.id }
                        if (countPromice === 3) {
                            dataSnapshot.push(fullData)
                            setdata([...dataSnapshot])
                        }
                    })
                    fullData.IdSpeciality.get().then((v) => {
                        countPromice++
                        fullData = { ...fullData, ...v.data(), IdSpecialityStr: v.id }
                        if (countPromice === 3) {
                            dataSnapshot.push(fullData)
                            setdata([...dataSnapshot])
                        }
                    })
                })
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    const loadLists = () => {
        db.collection("formEducation").get().then((querySnapshot) => {
            const dataSnapshot = []
            querySnapshot.forEach((d) => {
                console.log("loadLists -> d", d)
                const item = d.data()
                dataSnapshot.push({ key: d.id, text: item.NameForm, value: d.id })
            })
            setoptionsFormEducation(dataSnapshot)
        })
        db.collection("qualification").get().then((querySnapshot) => {
            const dataSnapshot = []
            querySnapshot.forEach((d) => {
                console.log("loadLists -> d", d)
                const item = d.data()
                dataSnapshot.push({ key: d.id, text: item.NameQualification, value: d.id })
            })
            setoptionsQualification(dataSnapshot)
        })
        db.collection("speciality").get().then((querySnapshot) => {
            const dataSnapshot = []
            querySnapshot.forEach((d) => {
                console.log("loadLists -> d", d)
                const item = d.data()
                dataSnapshot.push({ key: d.id, text: item.NameSpeciality, value: d.id })
            })
            setoptionsSpeciality(dataSnapshot)
        })
    }

    React.useEffect(() => {
        loadData()
        loadLists()
    }, [])

    const handleClickDelete = (row) => {
        db.collection('groups').doc(row.original.id).delete().then(() => {
            console.log("Document successfully deleted!");
            loadData()
        }).catch((error) => {
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
            Header: 'groupId',
            accessor: 'groupId',
            hide: true,
        },*/
        {
            Header: 'Направление подготовки',
            columns: [
                /*{
                    Header: 'specialityId',
                    accessor: 'specialityId',
                    hide: true,
                },*/
                {
                    Header: 'Направление',
                    accessor: 'NameSpeciality',
                },
                {
                    Header: 'Профиль',
                    accessor: 'Profile',
                },
            ],
        },
        {
            Header: 'Квадификация',
            columns: [
                /*{
                    Header: 'QualificationId',
                    accessor: 'QualificationId',
                    hide: true,
                },*/
                {
                    Header: 'Направление',
                    accessor: 'NameQualification',
                },
            ],
        },
        {
            Header: 'Форма обучения',
            columns: [
                /*{
                    Header: 'FormEducationId',
                    accessor: 'FormEducationId',
                    hide: true,
                },*/
                {
                    Header: 'Форма обучения',
                    accessor: 'NameForm',
                },
            ],
        },
        {
            Header: 'Факультет',
            accessor: 'Faculty',
        },
        {
            Header: 'Наименование группы',
            accessor: 'Name',
        },
        {
            Header: 'Курс',
            accessor: 'Course',
        },
        {
            Header: 'Количество студентов',
            accessor: 'CountStudent',
        },
        {
            Header: 'Количество подгрупп',
            accessor: 'CountSubgrroup',
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
            db.collection('groups').doc(modalValues.id).set({
                CountStudent: modalValues.CountStudent,
                CountSubgrroup: modalValues.CountSubgrroup,
                Course: modalValues.Course,
                Faculty: modalValues.Faculty,
                IdFormEducation: db.doc('formEducation/' + modalValues.IdFormEducationStr),
                IdQualification: db.doc('qualification/' + modalValues.IdQualificationStr),
                IdSpeciality: db.doc('speciality/' + modalValues.IdSpecialityStr),
                Name: modalValues.Name,
            }).then(function () {
                console.log("Document successfully written!");
                setOpen(false)
                loadData()
            });
        } else {
            db.collection('groups').doc().set({
                CountStudent: modalValues.CountStudent,
                CountSubgrroup: modalValues.CountSubgrroup,
                Course: modalValues.Course,
                Faculty: modalValues.Faculty,
                IdFormEducation: db.doc('formEducation/' + modalValues.IdFormEducationStr),
                IdQualification: db.doc('qualification/' + modalValues.IdQualificationStr),
                IdSpeciality: db.doc('speciality/' + modalValues.IdSpecialityStr),
                Name: modalValues.Name,
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
                <Modal.Content>
                    <Modal.Description>
                        <Form>

                            <Form.Field>
                                <label>Форма обучения</label>
                                <Dropdown
                                    onChange={(e, data) => {
                                        onChangeModalForm(['IdFormEducationStr', 'NameForm'], [data.value, data.text])
                                    }}
                                    value={modalValues.IdFormEducationStr}
                                    clearable
                                    options={optionsFormEducation}
                                    selection
                                />
                            </Form.Field>

                            <Form.Field>
                                <label>Квадификация</label>
                                <Dropdown
                                    onChange={(e, data) => { onChangeModalForm(['IdQualificationStr', 'NameQualification'], [data.value, data.text]) }}
                                    value={modalValues.IdQualificationStr}
                                    clearable
                                    options={optionsQualification}
                                    selection
                                />
                            </Form.Field>

                            <Form.Field>
                                <label>Направление</label>
                                <Dropdown onChange={(e, data) => { onChangeModalForm(['IdSpecialityStr', 'NameSpeciality'], [data.value, data.text]) }}
                                    value={modalValues.IdSpecialityStr}
                                    clearable
                                    options={optionsSpeciality}
                                    selection
                                />
                            </Form.Field>

                            <Form.Field><label>Факультет</label><Input onChange={(e, data) => { onChangeModalForm(['Faculty'], [data.value]) }} value={modalValues.Faculty || ''} /></Form.Field>
                            <Form.Field><label>Наименование группы</label><Input onChange={(e, data) => { onChangeModalForm(['Name'], [data.value]) }} value={modalValues.Name || ''} /></Form.Field>
                            <Form.Field><label>Курс</label><Input onChange={(e, data) => { onChangeModalForm(['Course'], [data.value]) }} value={modalValues.Course || ''} /></Form.Field>
                            <Form.Field><label>Количество студентов</label><Input onChange={(e, data) => { onChangeModalForm(['CountStudent'], [data.value]) }} value={modalValues.CountStudent || ''} /></Form.Field>
                            <Form.Field><label>Количество подгрупп</label><Input onChange={(e, data) => { onChangeModalForm(['CountSubgrroup'], [data.value]) }} value={modalValues.CountSubgrroup || ''} /></Form.Field>
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
