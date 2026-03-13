import { useEffect, useState } from "react"

export default function UsersPage() {

  const [users, setUsers] = useState([])

  useEffect(() => {

    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || []

    setUsers(storedUsers)

  }, [])

  return (

    <div className="space-y-6 max-w-4xl mx-auto">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          <span className="text-blue-700">Users</span> Management
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage registered users and their roles.
        </p>
      </div>

      {users.length === 0 ? (

        <p className="text-slate-500">
          No users found
        </p>

      ) : (

        <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">

          <div className="w-full overflow-x-auto px-4 pb-4">
            <table className="w-full min-w-[800px] table-fixed border-separate border-spacing-x-4">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[18%]" />
                <col className="w-[45%]" />
                <col className="w-[15%]" />
              </colgroup>

              <thead className="bg-slate-900 text-white">

                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    Role
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200">

                {users.map((user, idx) => (

                  <tr
                    key={user.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >

                    <td className="px-6 py-4 text-base font-mono text-slate-700 whitespace-nowrap">
                      {user.id}
                    </td>

                    <td className="px-6 py-4 text-base font-semibold text-slate-900 whitespace-nowrap">
                      {user.username}
                    </td>

                    <td className="px-6 py-4 text-base text-slate-700 break-all">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-base text-center">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 capitalize">
                        {user.role}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          </div>

        </div>

      )}

    </div>

  )

}
