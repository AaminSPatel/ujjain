"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Jan", bookings: 65, revenue: 162500 },
  { name: "Feb", bookings: 78, revenue: 195000 },
  { name: "Mar", bookings: 90, revenue: 225000 },
  { name: "Apr", bookings: 81, revenue: 202500 },
  { name: "May", bookings: 95, revenue: 237500 },
  { name: "Jun", bookings: 110, revenue: 275000 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="bookings" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
