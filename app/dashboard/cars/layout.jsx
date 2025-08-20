export default function CarsLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  )
}