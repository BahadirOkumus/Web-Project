import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react'

export default function AdminTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((h) => (
            <TableHeadCell key={h}>{h}</TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {rows.map((r, idx) => (
          <TableRow key={idx} className="bg-white">
            {r.map((c, i) => (
              <TableCell key={i}>{c}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
