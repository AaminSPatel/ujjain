import LogisticsClient from "./LogisticsClient"

export const metadata = {
  title: "Logistics Services - Ujjain Travel | Freight, Parcel & Moving Services",
  description:
    "Find reliable logistics services in Ujjain. Freight transport, parcel delivery, moving services, and heavy load transportation with verified providers.",
  keywords:
    "Ujjain logistics, freight services, parcel delivery, moving services, heavy load transport, international shipping",
  openGraph: {
    title: "Logistics Services - Ujjain Travel",
    description: "Reliable logistics and transportation services in Ujjain",
    images: ["/logistics-og.jpg"],
  },
}

export default function LogisticsPage() {
  return <LogisticsClient />
}
