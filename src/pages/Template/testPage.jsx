import React, { useState } from "react";
import { Table } from "../../common/Table/Table";

export function Test(props) {
    const columns = [
            {
                Header: 'Name',
                isVisible: false,
                columns: [
                    {
                        Header: 'First Name',
                        accessor: 'firstName',
                        isVisible: false,
                    },
                    {
                        Header: 'Last Name',
                        accessor: 'lastName',
                    },
                ],
            },
            {
                Header: 'Visits',
                accessor: 'visits',
            },
            {
                Header: 'Status',
                accessor: 'status',
            },
            {
                Header: 'Profile Progress',
                accessor: 'progress',
            },
        ]

    return <Table columns={columns} data={[]}></Table>
}
