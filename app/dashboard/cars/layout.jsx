export default function CarsLayout({ children }) {
  return (
    <div className="flex flex-col h-auto">
      <div className="flex-1 ">
        {children}
      </div>
    </div>
  )
}