
import './App.css';
import axios from "axios"
import { Center, Spinner, Table, Tbody, Th, Thead, Tr, Td } from '@chakra-ui/react'
import { useState,useEffect } from 'react';
import {useTable} from "react-table"


const url="https://api.github.com/repos/neovim/neovim/pulls?limit=30"
const tableColumn=[
  {
    Header:"Title",
    accessor:"title"
  },
  {
    Header:"Base-Branch",
    accessor:"base.ref"

  },
  {
    Header:"Author-Branch",
    accessor:"head.ref"

  },
  {
    Header:"Author",
    accessor:"user.login"

  },
  {
    Header:"Created-On",
    accessor:"created_at"

  },
  {
    Header: "Reviewers",
    accessor: value => {
      return value.requested_reviewers.map(reviewer => reviewer.login).join(' ,') || 'Not Available'
    }
  },
  {
    Header:"Labels",
    accessor: value => {
      return value.labels.map(label => label.name).join(' ,') || 'Not Available'
    }
  }
]
function App() {
  const [pullRequests, setPullRequests] = useState([])
  const [loader, setLoader] = useState(false)
  const {
    getTableProps, getTableBodyProps, headerGroups, rows, prepareRow
  } = useTable({
    columns: tableColumn,
    data: pullRequests,
  });

useEffect(() => {
  (async function (){
    try {
      setLoader(true)
      const {data} = await axios.get(url)
      setPullRequests(data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false)
    }
  })()
},[]);

  if(loader)
  return(
    <Center>
    <Spinner />
    </Center>
  )
  return (
  
    <div className="App">
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps()}>
                  {column.render("Header")}</Th>
            ))}
               </Tr>
            ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
    
    
    </div>
  );
}

export default App;
