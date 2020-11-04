import React, { useState } from "react";
import { Table } from "../../common/Table/Table";
import { db } from "../../api/firebase";
import { Button, Dropdown, Modal, Segment, Form, Input } from "semantic-ui-react";
import { Formik } from 'formik';
import * as Yup from 'yup';

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

    const clickOk = (values) => {
        if (modalValues.id) {
            db.collection('groups').doc(modalValues.id).set({
                CountStudent: values.CountStudent,
                CountSubgrroup: values.CountSubgrroup,
                Course: values.Course,
                Faculty: values.Faculty,
                IdFormEducation: db.doc('formEducation/' + values.IdFormEducationStr),
                IdQualification: db.doc('qualification/' + values.IdQualificationStr),
                IdSpeciality: db.doc('speciality/' + values.IdSpecialityStr),
                Name: values.Name,
            }).then(function () {
                console.log("Document successfully written!");
                setOpen(false)
                loadData()
            });
        } else {
            db.collection('groups').doc().set({
                CountStudent: values.CountStudent,
                CountSubgrroup: values.CountSubgrroup,
                Course: values.Course,
                Faculty: values.Faculty,
                IdFormEducation: db.doc('formEducation/' + values.IdFormEducationStr),
                IdQualification: db.doc('qualification/' + values.IdQualificationStr),
                IdSpeciality: db.doc('speciality/' + values.IdSpecialityStr),
                Name: values.Name,
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
                        IdFormEducationStr: '',
                        IdQualificationStr: '',
                        IdSpecialityStr: '',
                        Faculty: '',
                        Name: '',
                        Course: '',
                        CountStudent: '',
                        CountSubgrroup: '',
                    }}
                    initialValues={{
                        IdFormEducationStr: modalValues.IdFormEducationStr || null,
                        IdQualificationStr: modalValues.IdQualificationStr || null,
                        IdSpecialityStr: modalValues.IdSpecialityStr || null,
                        Faculty: modalValues.Faculty || '',
                        Name: modalValues.Name || '',
                        Course: modalValues.Course || '',
                        CountStudent: modalValues.CountStudent || '',
                        CountSubgrroup: modalValues.CountSubgrroup || '',
                    }}
                    onSubmit={(values) => {
                        console.log(values)

                    }}
                    validationSchema={Yup.object({
                        IdFormEducationStr: Yup.string().required('Обязательно для заполнения!'),
                        IdQualificationStr: Yup.string().required('Обязательно для заполнения!'),
                        IdSpecialityStr: Yup.string().required('Обязательно для заполнения!'),
                        Faculty: Yup.string().required('Обязательно для заполнения!'),
                        Name: Yup.string().required('Обязательно для заполнения!'),
                        Course: Yup.string().required('Обязательно для заполнения!'),
                        CountStudent: Yup.string().required('Обязательно для заполнения!'),
                        CountSubgrroup: Yup.string().required('Обязательно для заполнения!'),
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
                    }) => {
                        return (<>
                            <Modal.Content>
                                <Modal.Description>
                                    <Form>

                                        <Form.Field>
                                            <label>Форма обучения</label>
                                            <Dropdown
                                                id="IdFormEducationStr"
                                                name="IdFormEducationStr"
                                                type="IdFormEducationStr"
                                                onChange={(e, data) => {
                                                    handleChange({
                                                        target: {
                                                            id: "IdFormEducationStr",
                                                            name: "IdFormEducationStr",
                                                            type: "IdFormEducationStr",
                                                            value: data.value,
                                                        },
                                                        id: "IdFormEducationStr",
                                                        name: "IdFormEducationStr",
                                                        type: "IdFormEducationStr",
                                                        value: data.value,
                                                    })
                                                }}
                                                onBlur={handleBlur}
                                                value={values.IdFormEducationStr}
                                                clearable
                                                options={optionsFormEducation}
                                                selection
                                                error={touched.IdFormEducationStr && errors.IdFormEducationStr ? {
                                                    content: errors.IdFormEducationStr,
                                                    pointing: 'below',
                                                } : false}
                                            />
                                        </Form.Field>

                                        <Form.Field>
                                            <label>Квадификация</label>
                                            <Dropdown
                                                id="IdQualificationStr"
                                                name="IdQualificationStr"
                                                type="IdQualificationStr"
                                                style={{}}
                                                onChange={(e, data) => {
                                                    handleChange({
                                                        target: {
                                                            id: "IdQualificationStr",
                                                            name: "IdQualificationStr",
                                                            type: "IdQualificationStr",
                                                            value: data.value,
                                                        },
                                                        id: "IdQualificationStr",
                                                        name: "IdQualificationStr",
                                                        type: "IdQualificationStr",
                                                        value: data.value,
                                                    })
                                                }}
                                                onBlur={handleBlur}
                                                value={values.IdQualificationStr}
                                                clearable
                                                options={optionsQualification}
                                                selection
                                                error={touched.IdQualificationStr && errors.IdQualificationStr ? {
                                                    content: errors.IdQualificationStr,
                                                    pointing: 'below',
                                                } : false}
                                            />
                                        </Form.Field>

                                        <Form.Field>
                                            <label>Направление</label>
                                            <Dropdown
                                                id="IdSpecialityStr"
                                                name="IdSpecialityStr"
                                                type="IdSpecialityStr"
                                                onChange={(e, data) => {
                                                    handleChange({
                                                        target: {
                                                            id: "IdSpecialityStr",
                                                            name: "IdSpecialityStr",
                                                            type: "IdSpecialityStr",
                                                            value: data.value,
                                                        },
                                                        id: "IdSpecialityStr",
                                                        name: "IdSpecialityStr",
                                                        type: "IdSpecialityStr",
                                                        value: data.value,
                                                    })
                                                }}
                                                onBlur={handleBlur}
                                                value={values.IdSpecialityStr}
                                                clearable
                                                options={optionsSpeciality}
                                                selection
                                                error={touched.IdSpecialityStr && errors.IdSpecialityStr ? {
                                                    content: errors.IdSpecialityStr,
                                                    pointing: 'below',
                                                } : false}
                                            />
                                        </Form.Field>

                                        <Form.Field>
                                            <label>Факультет</label>
                                            <Input
                                                id="Faculty"
                                                name="Faculty"
                                                type="Faculty"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.Faculty || ''}
                                                error={touched.Faculty && errors.Faculty ? {
                                                    content: errors.Faculty,
                                                    pointing: 'below',
                                                } : false}
                                            />
                                        </Form.Field>

                                        <Form.Field>
                                            <label>Наименование группы</label>
                                            <Input
                                                id="Name"
                                                name="Name"
                                                type="Name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.Name || ''}
                                                error={touched.Name && errors.Name ? {
                                                    content: errors.Name,
                                                    pointing: 'below',
                                                } : false}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Курс</label>
                                            <Input
                                                id="Course"
                                                name="Course"
                                                type="Course"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.Course || ''}
                                                error={touched.Course && errors.Course ? {
                                                    content: errors.Course,
                                                    pointing: 'below',
                                                } : false}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Количество студентов</label>
                                            <Input
                                                id="CountStudent"
                                                name="CountStudent"
                                                type="CountStudent"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.CountStudent || ''}
                                                error={touched.CountStudent && errors.CountStudent ? {
                                                    content: errors.CountStudent,
                                                    pointing: 'below',
                                                } : false}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Количество подгрупп</label>
                                            <Input
                                                id="CountSubgrroup"
                                                name="CountSubgrroup"
                                                type="CountSubgrroup"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.CountSubgrroup || ''}
                                                error={touched.CountSubgrroup && errors.CountSubgrroup ? {
                                                    content: errors.CountSubgrroup,
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
                        </>)
                    }}
                </Formik>
            </Modal>
        </>
    )
}
