import React, { Component } from 'react';
import { useTable, useFilters } from 'react-table'
import namor from 'namor'


const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const columns = [  
      {
        Header: 'ID',
        accessor: 'id',
        Filter: ''
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Edition',
        accessor: 'edition',
        Filter: ''
      },
      { 
        Header: 'Price',
        accessor: 'price',
        Filter: ''
      },
      {
        Header: 'Owner',
        accessor: 'owner',
        Filter: ''
      },
      {
        Header: 'Request',
        accessor: 'request',
        Filter: ''
      },
]

  // Define a default UI for filtering
function DefaultColumnFilter({
     column: { filterValue, preFilteredRows, setFilter },
      }) {
    const count = preFilteredRows.length

  return (
    <input
    value={filterValue || ''}
    onChange={e => {
      setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
    }}
    placeholder={`Search ${count} records...`}
    />
    )
}

  // This is a custom filter UI for selecting
  // a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
  }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
      })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={e => {
      setFilter(e.target.value || undefined)
    }}
      >
    <option value="">All</option>
      {options.map((option, i) => (
      <option key={i} value={option}>
        {option}
      </option>
      ))}
    </select>
    )
}

// Our table component
function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters // useFilters!
  )

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const firstPageRows = rows.slice(0, 10)

  return (
    <>
      {/*<div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>  */}
      <table {...getTableProps()} className = "table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>

                    ) 
                  })}
                </tr>
              )}
          )}

        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  )
}

class Main extends Component {

  render() {

    const newData = this.props.books.map(book => {

    return { 

          id: book.id,
          name: book.name,
          edition: book.edition,
          price: window.web3.utils.fromWei(book.price.toString(), 'Ether'),
          owner: book.owner,
          request: !book.hold
                   ? <button 
                        className="requestButton"
                        name = {book.id}
                        onClick={(event) => {
                          this.props.requestBook(event.target.name)
                        }}
                        >
                          Request
                        </button>
                   : "Requested" }

      })
    console.log(newData)

    return (
      <div id="content" style={{ maxWidth: "100%" }}> 
        <p>&nbsp;</p>
        <h2>Please Add a New Book</h2>
        <form onSubmit={(event) => {
          //
          event.preventDefault()
          const name = this.bookName.value
          const edition = this.bookEdition.value
          const price = window.web3.utils.toWei(this.bookPrice.value.toString(), 'ether')
          this.props.createBook(name, edition, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="bookName"
              type="text"
              ref={(input) => { this.bookName = input }}
              className="form-control"
              placeholder="Book Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="bookEdition"
              type="text"
              ref={(input) => { this.bookEdition = input }}
              className="form-control"
              placeholder="Book Edition"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="bookPrice"
              type="text"
              ref={(input) => { this.bookPrice = input }}
              className="form-control"
              placeholder="Book Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Book</button>
        </form>
        <h2>Browse Available Books</h2>
        {/*
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Edition</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Request</th>
            </tr>
          </thead>
          <tbody id="bookList">
            { this.props.books.map((book, key) => {
              return(
              <tr key={key}>
                <th scope="row">{book.id.toString()}</th>
                <td>{book.name}</td>
                <th scope="row">{book.edition.toString()}</th>
                <td>{window.web3.utils.fromWei(book.price.toString(), 'Ether')}</td>
                <td>{book.owner}</td>
                <td>  
                    { !book.hold
                      ? <button 
                        className="requestButton"
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          this.props.requestBook(event.target.name)
                        }}
                        >
                          Request
                        </button>
                      : <button 
                        className="requestButton"
                        disabled = {true}
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          console.log("already requested!")
                        }}
                        >
                          Requested
                        </button>
                    }
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
        */}
        <Table columns={columns} data={newData} />
      </div>
    );
  }
}

export default Main; 