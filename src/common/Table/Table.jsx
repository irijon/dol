import React, { useState, useRef, useEffect, forwardRef } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy, useFilters, usePagination, useRowSelect, useBlockLayout, useResizeColumns } from 'react-table'
import { Table as SemTable, Label } from 'semantic-ui-react'

const Styles = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .tableWrap {
    // align-self: flex-start;
    width: fit-content;
    height: 100%;
    overflow: auto;
    max-width: calc(100vw - 30px);
    table {
      display: inline-block;
      border-spacing: 0;
      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }

      td{
        button{
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      th,
      td {
        width: 100%;
        margin: 0;
        padding: 0.5rem;
        display: flex !important;
        flex-direction: column;
        ${'' /* In this example we use an absolutely position resizer,
        so this is required. */}
        position: relative;

        :last-child {
          border-right: 0;
        }

        input {
          width: 90%;
          outline: none;
          justify-self: flex-end;
          align-self: center;
          :active{
            outline: none;
          }
        }

        .resizer {
          display: inline-block;
          width: 2px;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          transform: translateX(50%);
          z-index: 1;
          ${'' /* prevents from scrolling while dragging on touch devices */}
          touch-action:none;

          &.isResizing {
            background: black;
          }
        }
      }
    }
  }
  .pagination {
    padding: 1rem;
  }
`

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        e.persist()
        setFilter(e.target.value || undefined)
      }}
      placeholder={`Поиск`}
    />
  )
}

const IndeterminateButton = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef()
    const resolvedRef = ref || defaultRef

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <button ref={resolvedRef} {...rest}>ok</button>
      </>
    )
  }
)

export function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    allColumns,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, filters },
    resetResizing,
  } = useTable({
    columns,
    data,
    defaultColumn,
    initialState: { pageIndex: 0 },
  },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useResizeColumns,
    /*hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Cell: ({ row }) => (
            <div>
              <IndeterminateButton {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }*/
  )

  return (
    <>
      <Styles>
        <div className={"tableWrap"}>
          <SemTable style={{width:'auto'}} {...getTableProps()}>
            <SemTable.Header>
              {headerGroups.map(headerGroup => (
                <SemTable.Row {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => {
                    return <SemTable.HeaderCell textAlign={'center'} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <div
                        {...column.getResizerProps()}
                        className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                      />
                    </SemTable.HeaderCell>
                  })}
                </SemTable.Row>
              ))}
              {headerGroups.map(headerGroup => (
                <SemTable.Row {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => {
                    return <SemTable.HeaderCell textAlign={'center'} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.canFilter ? column.render('Filter') : null}
                      <div
                        {...column.getResizerProps()}
                        className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                      />
                    </SemTable.HeaderCell>
                  })}
                </SemTable.Row>
              ))}
            </SemTable.Header>
            <SemTable.Body {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <SemTable.Row {...row.getRowProps()}>
                    {row.cells.map((cell,i) => {
                      return <SemTable.Cell textAlign={'center'} key={i.toString()} {...{ style: { ...cell.getCellProps().style } }}>{cell.render('Cell')}</SemTable.Cell>
                    })}
                  </SemTable.Row>
                )
              })}
            </SemTable.Body>
          </SemTable>
        </div>
        {/* pagination */}
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                e.persist()
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              e.persist()
              setPageSize(Number(e.target.value))
            }}
          >
            {[5, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </Styles>
    </>
  )
}
