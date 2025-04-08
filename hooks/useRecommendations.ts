import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function useRecommendations(
  sourceParam: string = "all",
  discoverParam: boolean = false
) {
  const { data: session, status } = useSession()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== "authenticated") {
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        const query = new URLSearchParams()
        if (sourceParam) {
          query.set("source", sourceParam)
        }
        // if discoverParam is true, we add discover=1
        if (discoverParam) {
          query.set("discover", "1")
        }

        const res = await fetch(`/api/for-you?${query.toString()}`, {
          method: "GET",
        })
        if (!res.ok) {
          throw new Error("Failed to fetch recommendations")
        }
        const data = await res.json()
        setRecommendations(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status, sourceParam, discoverParam])

  return { recommendations, loading }
}
