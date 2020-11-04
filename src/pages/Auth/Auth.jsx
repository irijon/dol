import React, { useState } from 'react'
import { Input, Segment, Button, Form } from 'semantic-ui-react';
import { Auth } from '../../api/firebase'
import { withRouter } from "react-router";
import { useFormik } from 'formik';
import * as Yup from 'yup';

function AuthFormForm(props) {
    const [loading, setLoad] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            password: Yup.string().min(8, 'Пароль должен содержать минимум 8 знаков')
                .required('Обязательно для заполнения!'),
            email: Yup.string().email('Не правильный email').required('Обязательно для заполнения!'),
        }),
        onSubmit: values => {
            console.log(values)
            setLoad(true)
            Auth.signInWithEmailAndPassword(values.email, values.password)
                .then(function () {
                    console.log("AuthForm -> Sign-in")
                    setLoad(false)
                    props.history.push('/groups')
                })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("errorMessage ", errorMessage, errorCode)
                    setLoad(false)
                });
        },
    });

    return (
        <Segment style={{ margin: '10px', width: '300px' }} padded loading={loading}>
            <Form>
                <Form.Field
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    control={Input}
                    placeholder='Email'
                    error={formik.touched.email && formik.errors.email ? {
                        content: formik.errors.email,
                        pointing: 'below',
                    } : false}
                />
                <Form.Field
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    control={Input}
                    placeholder='Пароль'
                    error={formik.touched.password && formik.errors.password ? {
                        content: formik.errors.password,
                        pointing: 'below',
                    } : false}
                />
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Form.Field
                        id='form-button-control-public'
                        control={Button}
                        content='Войти'
                        primary
                        onClick={formik.handleSubmit}
                        type="submit"
                    />
                    <Form.Field
                        id='form-button-control-public'
                        control={Button}
                        content='Выход'
                        secondary
                        onClick={() => {
                            setLoad(true)
                            Auth.signOut()
                                .then(function () {
                                    console.log("AuthForm -> Sign-out")
                                    setLoad(false)
                                })
                                .catch(function (error) {
                                    console.log("AuthForm -> An error happened.")
                                    setLoad(false)
                                });
                        }}
                    />
                </div>
            </Form>
        </Segment>
    )
}

const AuthForm = withRouter(AuthFormForm)

export { AuthForm }